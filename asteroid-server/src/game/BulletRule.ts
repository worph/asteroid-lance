
import LanceGameModel from "../../../asteroid-common/src/lance/LanceGameModel";
import LancePhysic2DObject from "../../../asteroid-common/src/lance/LancePhysic2DObject";
import {AssetIDGenerator} from "../../../asteroid-common/src/lance/AssetIDGenerator";

export default class BulletRule {

    constructor(private gameModel:LanceGameModel) {

    }

    update(){
        let keys = Object.keys(this.gameModel.world.objects);
        keys.forEach((key, index, array) => {
            let object = this.gameModel.world.objects[key];
            if(object instanceof LancePhysic2DObject){
                let asset = object as LancePhysic2DObject;
                if(asset.assetId.startsWith(AssetIDGenerator.BULLET_PREFIX)){
                    //reduce life span
                }
            }
        });
    }
}
