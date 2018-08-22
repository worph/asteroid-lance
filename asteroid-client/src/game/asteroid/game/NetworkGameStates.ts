import {Ship} from "../objects/Ship";
import {Asteroid} from "../objects/Asteroid";
import NetworkGameRules from "./NetworkGameRules";
import LanceGameModel from "../lance/shared/LanceGameModel";
import LanceClientEngine from "../lance/LanceClientEngine";
import Trace from 'lance-gg/es5/lib/Trace';
import {MiniECS} from "../service/miniECS/MiniECS";
import {LanceFatory} from "../lance/LanceFatory";

export class NetworkGameStates {

    public networkGameManager: NetworkGameRules = new NetworkGameRules();
    clientEngine: LanceClientEngine;
    gameEngine: LanceGameModel;

    /* networked items model*/
    public toFollow: Phaser.GameObjects.Graphics;
    miniECS: MiniECS;
    lanceFactory: LanceFatory;

    getObjectToFollow():Phaser.GameObjects.Graphics{
        return this.toFollow;
    }

    constructor(public scene: Phaser.Scene, public apiServerAdd: string) {
        this.toFollow = null;

        {
            //LANCE GG
            // sent to both game engine and client engine
            const options = {
                traceLevel: Trace.TRACE_NONE,
                delayInputCount: 8,
                scheduler: 'render-schedule',
                matchmaker: apiServerAdd+"/asteroid-lance/matchmaker",
                syncOptions: {
                    sync: 'extrapolate',
                    localObjBending: 0.2,
                    remoteObjBending: 0.5
                }
            };

            // create a client engine and a game engine
            this.gameEngine = new LanceGameModel(options);
            this.clientEngine = new LanceClientEngine(this.gameEngine, options);
            this.lanceFactory = new LanceFatory(this.gameEngine,this.clientEngine);
            this.miniECS = new MiniECS();

            this.clientEngine.start();
        }
    }
}