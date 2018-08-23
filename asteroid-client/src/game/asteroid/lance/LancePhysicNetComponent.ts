import {Component} from "../service/miniECS/Component";
import LanceAsset from "./shared/LancePhysic2DObject";
import InputDefinition from "./shared/InputDefinition";
import LanceClientEngine from "./LanceClientEngine";

export class LancePhysicNetComponent implements Component{
    assetId:string;
    body : LanceAsset;
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