import NetworkGameRules from "./NetworkGameRules";
import LanceGameModel from "../lance/shared/LanceGameModel";
import LanceClientEngine from "../lance/LanceClientEngine";
import {MiniECS} from "../service/miniECS/MiniECS";
import {LanceAssetService} from "../lance/LanceAssetService";
import {LancePhaserLink} from "../service/lancePhaserLink/LancePhaserLink";
import {KeyMapper} from "../input/KeyMapper";
import {ShipFactory} from "../objects/ShipFactory";
import Lance from "../lance/shared/Lance";

export class NetworkGameStates {

    ////////////////////////////////////
    //Lance/Physic Pure
    ////////////////////////////////////
    gameModelControler: LanceClientEngine;
    gameEngine: LanceGameModel;

    ////////////////////////////////////
    //ECS
    ////////////////////////////////////
    miniECS: MiniECS;
    lanceService: LanceAssetService;//lance ECS service
    lancePhaserLink: LancePhaserLink;//lance phaser link ECS service
    keyMapper: KeyMapper; // input ECS service

    ////////////////////////////////////
    ////////////////////////////////////

    public networkGameManager: NetworkGameRules;

    /* networked items model*/
    shipFactory: ShipFactory;

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

            this.shipFactory = new ShipFactory(this,this.scene);

            // create a client engine and a game engine
            this.gameEngine = new LanceGameModel(options);
            this.gameModelControler = new LanceClientEngine(this.gameEngine, options,this.shipFactory);
            this.lanceService = new LanceAssetService(this.gameEngine, this.gameModelControler);
            this.lancePhaserLink = new LancePhaserLink();
            this.miniECS = new MiniECS();

            this.keyMapper = new KeyMapper(this.scene);
            this.networkGameManager = new NetworkGameRules();

            this.gameModelControler.start();
            this.gameEngine.once("postStep",()=>{
                console.log("server ready");
                resolve("server ready");
            });
        });
    }

    update(){
        this.keyMapper.update();
        this.lancePhaserLink.update();
    }
}