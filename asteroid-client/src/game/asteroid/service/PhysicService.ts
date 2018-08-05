import {Identified, IDENTIFIED_NO_VALUE} from "./network/Asset";
import * as EventEmitter from "eventemitter3";
import {RenderLoop} from "./RenderLoop";

export class PhysicService {

    private _eventEmitter = new EventEmitter();
    renderLoop:RenderLoop = new RenderLoop(collisionEvent => {
        this.processEvent(collisionEvent);
    })

    constructor(public matter: any) {
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            let collisionEvent = {event:event,bodyA:bodyA,bodyB:bodyB};
            this.renderLoop.notifyEvent(collisionEvent);
        });
    }

    processEvent(collisionEvent){
        let event = collisionEvent.event;
        let bodyA = collisionEvent.bodyA;
        let bodyB = collisionEvent.bodyB;
        //TODO check if all those if are necesary in this point optim concern /!\
        let bodyAid:string = "";
        if (bodyA.gameObject != null) {
            if (bodyA.gameObject != undefined) {
                if (bodyA.gameObject.id != undefined) {
                    bodyAid = bodyA.gameObject.id;
                }
            }
        }
        let bodyBid:string = "";
        if (bodyB.gameObject != null) {
            if (bodyB.gameObject != undefined) {
                if (bodyB.gameObject.id != undefined) {
                    bodyBid = bodyB.gameObject.id;
                }
            }
        }
        if (bodyAid!=="") {
            this._eventEmitter.emit(bodyAid, bodyBid!="" ? bodyB.gameObject : IDENTIFIED_NO_VALUE);
        }
        if (bodyBid!="") {
            this._eventEmitter.emit(bodyBid, bodyAid!=="" ? bodyA.gameObject : IDENTIFIED_NO_VALUE);
        }
    }

    update(){
        this.renderLoop.update();
    }

    get eventEmitter(): EventEmitter<string | symbol> {
        return this._eventEmitter;
    }
}