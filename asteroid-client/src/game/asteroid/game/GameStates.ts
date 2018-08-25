import NetworkGameRules from "./NetworkGameRules";
import LanceGameModel from "asteroid-common/dist/lance/LanceGameModel";
import LanceClientEngine from "../lance/LanceGameModelControler";
import {MiniECS} from "../service/miniECS/MiniECS";
import {LanceAssetService} from "../lance/LanceAssetService";
import {LancePhaserLink} from "../service/lancePhaserLink/LancePhaserLink";
import {KeyMapper} from "../input/KeyMapper";
import {ShipFactory} from "../objects/ShipFactory";
import Lance from "asteroid-common/dist/lance/Lance";
import {BulletFactory} from "../objects/BulletFactory";
import {AsteroidFactory} from "../objects/AsteroidFactory";

export class GameStates {

    ////////////////////////////////////
    //Lance => Physic/Network Pure
    ////////////////////////////////////
    gameModelControler: LanceClientEngine;
    gameModel: LanceGameModel;

    ////////////////////////////////////
    //ECS
    ////////////////////////////////////
    miniECS: MiniECS;
    lanceService: LanceAssetService;//lance ECS service
    lancePhaserLink: LancePhaserLink;//lance phaser link ECS service
    keyMapper: KeyMapper; // input ECS service

    ////////////////////////////////////
    //Game object factories
    ////////////////////////////////////
    shipFactory: ShipFactory;
    bulletFactory: BulletFactory;
    asteroidFactory: AsteroidFactory;

    ////////////////////////////////////
    ////////////////////////////////////

    public networkGameManager: NetworkGameRules;

    /* networked items model*/

    constructor(private scene: Phaser.Scene, private apiServerAdd: string) {
    }

    start():Promise<any>{
        return new Promise(resolve => {
            //LANCE GG
            // sent to both game engine and client engine
            const options = {
                traceLevel: Lance.Trace.TRACE_WARN,
                delayInputCount: 8,
                scheduler: 'render-schedule',
                matchmaker: this.apiServerAdd + "/asteroid-lance/matchmaker",
                syncOptions: {
                    sync: 'extrapolate',
                    localObjBending: 0.2,
                    remoteObjBending: 0.5
                }
            };

            this.bulletFactory = new BulletFactory(this,this.scene);
            this.shipFactory = new ShipFactory(this,this.scene,this.bulletFactory);
            this.asteroidFactory = new AsteroidFactory(this,this.scene);

            // create a client engine and a game engine
            this.gameModel = new LanceGameModel(options);
            this.gameModelControler = new LanceClientEngine(this.gameModel, options,this.shipFactory,this.bulletFactory,this.asteroidFactory);
            this.lanceService = new LanceAssetService(this.gameModel, this.gameModelControler);
            this.lancePhaserLink = new LancePhaserLink();
            this.miniECS = new MiniECS();

            this.keyMapper = new KeyMapper(this.scene);
            this.networkGameManager = new NetworkGameRules();

            this.gameModelControler.start();
            this.gameModel.once("postStep",()=>{
                setTimeout(()=>{
                    console.log("server ready");
                    resolve("server ready");
                },1000);
            });
        });
    }

    update(){
        this.keyMapper.update();
        this.lancePhaserLink.update();
    }
}