
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceRenderer from "./LanceRenderer";
import InputDefinition from "./shared/InputDefinition";
import {EventEmitter} from 'eventemitter3';
import LanceAsset from "./shared/LancePhysic2DObject";
import {ShipFactory} from "../objects/ShipFactory";

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceClientEngine extends ClientEngine {

    eventEmitter = new EventEmitter();
    waitingObjects: {[id:string]:boolean} = {};//hashset

    constructor(public gameEngine, options,private shipFactory:ShipFactory) {
        super(gameEngine, options, LanceRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{
            if(obj instanceof LanceAsset) {
                if(obj.id <1000000) {//we ignore temporary objects
                    if (this.waitingObjects[obj.assetId]) {
                        this.eventEmitter.emit(obj.assetId, obj);
                    } else if (this.shipFactory.isValidNetBody(obj)) {
                        this.shipFactory.createFromNetwork(obj);
                    } else {
                        console.error("unknown object 1");
                    }
                }
            }else{
                console.error("unknown object 2");
            }
        });
    }


    requestObjectCreation(option:ObjectCreationData):Promise<any>{
        this.waitingObjects[option.assetId]=true;
        this.sendInput(InputDefinition.CREATE, option);
        return new Promise<any>(resolve => {
            this.eventEmitter.once(option.assetId,(obj)=>{
                delete this.waitingObjects[option.assetId];
                resolve(obj);
            });
        });
    }

    // extend ClientEngine connect to add own events
    connect() {
        return super.connect();
    }


    sendInput(input: string, inputOptions: any) {
        super.sendInput(input,inputOptions);
    }

}
