import {Identified, IDENTIFIED_NO_VALUE} from "./network/Asset";
import * as EventEmitter from "eventemitter3";

export class PhysicService {

    private _eventEmitter = new EventEmitter();

    constructor(public matter: any) {
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            //TODO check if all those if are necesary in this point optim concern /!\
            let bodyAOk = false;
            if (!(bodyA.gameObject == undefined || bodyA.gameObject == null)) {
                if (bodyA.gameObject.id != undefined) {
                    bodyAOk = true;
                }
            }
            let bodyBOk = false;
            if (!(bodyB.gameObject == undefined || bodyB.gameObject == null)) {
                if (bodyB.gameObject.id != undefined) {
                    bodyBOk = true;
                }
            }
            if (bodyAOk) {
                this._eventEmitter.emit(bodyA.gameObject.id, bodyBOk ? bodyB.gameObject : IDENTIFIED_NO_VALUE);
            }
            if (bodyBOk) {
                this._eventEmitter.emit(bodyB.gameObject.id, bodyAOk ? bodyA.gameObject : IDENTIFIED_NO_VALUE);
            }
        });
    }

    get eventEmitter(): EventEmitter<string | symbol> {
        return this._eventEmitter;
    }
}