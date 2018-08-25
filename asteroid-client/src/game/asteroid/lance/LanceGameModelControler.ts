
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceRenderer from "./LanceRenderer";
import InputDefinition from "asteroid-common/dist/lance/InputDefinition";
import {EventEmitter} from 'eventemitter3';
import LanceAsset from "asteroid-common/dist/lance/LancePhysic2DObject";
import {ShipFactory} from "../objects/ShipFactory";
import {BulletFactory} from "../objects/BulletFactory";
import {AsteroidFactory} from "../objects/AsteroidFactory";

export interface ObjectCreationData{
    assetId:string,
    props:any
}

export default class LanceGameModelControler extends ClientEngine {

    eventEmitter = new EventEmitter();
    waitingObjects: {[id:string]:boolean} = {};//hashset

    constructor(public gameEngine, options,private shipFactory:ShipFactory,private bulletFactory:BulletFactory,private asteroidFactory:AsteroidFactory) {
        super(gameEngine, options, LanceRenderer);
    }

    start() {
        super.start();
        this.gameEngine.on("objectAdded",(obj:any)=>{
            if(obj instanceof LanceAsset) {
                if (this.waitingObjects[obj.assetId]) {
                    this.eventEmitter.emit(obj.assetId, obj);
                } else if (this.shipFactory.isValidNetBody(obj)) {
                    this.shipFactory.createFromNetwork(obj);
                } else if (this.bulletFactory.isValidNetBody(obj)) {
                    this.bulletFactory.createFromNetwork(obj);
                } else if (this.asteroidFactory.isValidNetBody(obj)) {
                    this.asteroidFactory.createFromNetwork(obj);
                } else {
                    console.error("unknown asset : "+obj.assetId);
                }
            }else{
                console.error("unknown object");
            }
        });
    }


    requestObjectCreation(option:ObjectCreationData,callback:(obj:any)=>void):void{
        this.waitingObjects[option.assetId]=true;
        this.sendInput(InputDefinition.CREATE, option);
        this.eventEmitter.once(option.assetId,(obj)=>{
            callback(obj);//temporary object
            if(obj.id >=1000000) {
                this.eventEmitter.once(option.assetId,(obj)=>{
                    delete this.waitingObjects[option.assetId];
                    callback(obj);//final object
                });
            }
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
