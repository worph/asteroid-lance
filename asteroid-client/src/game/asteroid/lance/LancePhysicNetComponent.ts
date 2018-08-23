import {Component} from "../service/miniECS/Component";
import LanceAsset from "./shared/LanceAsset";
import InputDefinition from "./shared/InputDefinition";
import LanceClientEngine from "./LanceClientEngine";

export class LancePhysicNetComponent implements Component{
    assetId:string;
    body : LanceAsset;
    client:LanceClientEngine;

    rotateRight(state:boolean){
        this.client.sendInput(InputDefinition.ROTATE_RIGHT, {
            id:this.body.id,
            state:state
        });
    }

    rotateLeft(state:boolean){
        this.client.sendInput(InputDefinition.ROTATE_LEFT, {
            id:this.body.id,
            state:state
        });
    }

    accelerate(state:boolean){
        this.client.sendInput(InputDefinition.ACCELERATE, {
            id:this.body.id,
            state:state
        });
    }
}