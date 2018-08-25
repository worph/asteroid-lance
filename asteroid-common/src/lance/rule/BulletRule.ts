
import LanceGameModel from "../LanceGameModel";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import {AssetIDGenerator} from "../const/AssetIDGenerator";

export default class BulletRule {

    constructor(private gameModel:LanceGameModel) {

    }

    update(){
        let keys = Object.keys(this.gameModel.world.objects);
        keys.forEach((key, index, array) => {
            let object = this.gameModel.world.objects[key];
            if(object instanceof LancePhysic2DObject){
                let asset = object as LancePhysic2DObject;
                /*if(asset.assetId.startsWith(AssetIDGenerator.BULLET_PREFIX)){
                    //reduce life span
                }*/
            }
        });
    }
}
