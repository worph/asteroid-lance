import {Component} from "../service/miniECS/Component";
import LancePhysic2DObject from "asteroid-common/dist/lance/LancePhysic2DObject";
import InputDefinition from "asteroid-common/dist/lance/InputDefinition";
import LanceClientEngine from "./LanceGameModelControler";

export class LancePhysicNetComponent implements Component{
    assetId:string;
    body : LancePhysic2DObject;
    client:LanceClientEngine;

    rotateRight(speed:number){
        this.client.sendInput(InputDefinition.ROTATE_RIGHT, {
            id:this.body.id,
            speed:speed
        });
    }

    rotateLeft(speed:number){
        this.client.sendInput(InputDefinition.ROTATE_LEFT, {
            id:this.body.id,
            speed:speed
        });
    }

    accelerate(vector:{x:number,y:number}){
        this.client.sendInput(InputDefinition.ACCELERATE, {
            id:this.body.id,
            vector:vector
        });
    }
}