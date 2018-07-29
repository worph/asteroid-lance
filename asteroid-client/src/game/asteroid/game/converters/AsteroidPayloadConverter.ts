import {Asset} from "../../service/network/Asset";
import {Asteroid} from "../../objects/Asteroid";
import {AssetConverter} from "../../service/network/AssetConverter";

export class AsteroidPayloadConverter implements AssetConverter<Asteroid> {
    scene: Phaser.Scene;

    createItemFromNetworkPayload(asset: Asset): Asteroid {
        let asteroid = new Asteroid({
            scene: this.scene,
            opt:{}
        }, asset.id, 0, 0, asset.value[6]);
        this.updateItemFromNetworkPayload(asteroid, asset);
        return asteroid;
    }

    makeNetworkPayloadFromItem(asteroid: Asteroid): Asset {
        let body = asteroid.getBody();
        return {
            id: asteroid.id,
            value: [
                body.x,//0
                body.y,//1
                body.rotation,//2
                body.body.velocity.x,//3
                body.body.velocity.y,//4
                body.body.angularVelocity,//5
                asteroid.getSize()]//6
        }
    }

    updateItemFromNetworkPayload(asteroid: Asteroid, payload: Asset): void {
        if(asteroid==undefined){
            console.error("undefined asteroid")
            return;
        }
        let body = asteroid.getBody();
        body.setPosition(payload.value[0],payload.value[1]);
        body.setRotation(payload.value[2]);
        body.setVelocity(payload.value[3], payload.value[4]);
        body.setAngularVelocity(payload.value[5]);
        //size is ignored
    }
}
