import NetworkGameRules from "./NetworkGameRules";
import LanceGameModel from "asteroid-common/dist/lance/LanceGameModel";
import LanceClientEngine from "../lance/LanceGameModelControler";
import {MiniECS} from "asteroid-common/dist/miniECS/MiniECS";
import {LancePhaserLink} from "../service/lancePhaserLink/LancePhaserLink";
import {KeyMapper} from "../input/KeyMapper";
import Lance from "asteroid-common/dist/lance/const/Lance";

export class GameStates {

    ////////////////////////////////////
    //Lance => Physic/Network Pure
    ////////////////////////////////////
    gameModelControler: LanceClientEngine;
    gameModel: LanceGameModel;

    ////////////////////////////////////
    //ECS
    ////////////////////////////////////
    ecs: MiniECS;
    lancePhaserLink: LancePhaserLink;//lance phaser link ECS service
    keyMapper: KeyMapper; // input ECS service

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

            // create a client engine and a game engine
            this.gameModel = new LanceGameModel(options);
            this.lancePhaserLink = new LancePhaserLink();
            this.keyMapper = new KeyMapper(this.scene);
            this.ecs = new MiniECS();

            this.gameModelControler = new LanceClientEngine(this.gameModel, options,this.scene,this.lancePhaserLink,this.keyMapper,this.ecs);

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