
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceRenderer from "./LanceRenderer";
import InputDefinition from "./shared/InputDefinition";
import {EventEmitter} from 'eventemitter3';
import LanceAsset from "./shared/LanceAsset";
import {ShipFactory} from "../objects/ShipFactory";

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceClientEngine extends ClientEngine {

    eventEmitter = new EventEmitter();

    constructor(public gameEngine, options,private shipFactory:ShipFactory) {
        super(gameEngine, options, LanceRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{

            if(obj instanceof LanceAsset) {
                this.eventEmitter.emit(obj.assetId,obj);
                if(this.shipFactory.isValidNetBody(obj)) {
                    this.shipFactory.createFromNetwork(obj);
                }
            }else{
                console.error("unknown object");
            }
        });
    }


    requestObjectCreation(option:ObjectCreationData):Promise<any>{
        this.sendInput(InputDefinition.CREATE, option);
        return new Promise<any>(resolve => {
            this.eventEmitter.once(option.assetId,(obj)=>{
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
