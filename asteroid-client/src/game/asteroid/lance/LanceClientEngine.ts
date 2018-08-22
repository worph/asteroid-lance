
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceModelRenderer from "./NetworkModel";
import InputDefinition from "./shared/InputDefinition";
import EventEmitter from 'eventemitter3';

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceClientEngine extends ClientEngine {

    eventEmitter = new EventEmitter();

    constructor(gameEngine, options) {
        super(gameEngine, options, LanceModelRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{
            if("assetId" in obj)
            this.eventEmitter.emit(obj.assetId,obj);
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
