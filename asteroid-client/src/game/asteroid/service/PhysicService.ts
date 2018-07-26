import {Identified} from "./Asset";
import * as EventEmitter from "eventemitter3";

export class PhysicService {

    private _eventEmitter = new EventEmitter();

    constructor(public matter:any) {
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            //TODO check if all those if are necesary in this point optim concern /!\
            if(bodyA.gameObject == undefined || bodyA.gameObject == null){
                console.warn("is it normal?");
                return;
            }
            if(bodyB.gameObject == undefined || bodyB.gameObject == null){
                console.warn("is it normal?");
                return;
            }
            if(bodyA.gameObject.id == undefined){
                console.warn("is it normal?");
                return;
            }
            if(bodyB.gameObject.id == undefined){
                console.warn("is it normal?");
                return;
            }
            let identifiedObjectA = bodyA.gameObject as Identified;
            let identifiedObjectB = bodyB.gameObject as Identified;
            if(identifiedObjectA == undefined || identifiedObjectA == null){
                console.warn("is it normal?");
                return;
            }
            if(identifiedObjectB == undefined || identifiedObjectB == null){
                console.warn("is it normal?");
                return;
            }
            this._eventEmitter.emit(identifiedObjectA.id,identifiedObjectB);
            this._eventEmitter.emit(identifiedObjectB.id,identifiedObjectA);
        });
    }

    get eventEmitter(): EventEmitter<string | symbol> {
        return this._eventEmitter;
    }
}