import {Asset} from "../../service/network/Asset";
import {Asteroid} from "../../objects/Asteroid";
import {AssetConverter} from "../../service/network/AssetConverter";

export class AsteroidPayloadConverter implements AssetConverter<Asteroid> {
    private scene: Phaser.Scene;
    private asteroids: { [id: string]: Asteroid; };

    constructor(scene: Phaser.Scene, asteroids: { [p: string]: Asteroid }) {
        this.scene = scene;
        this.asteroids = asteroids;
    }

    createItemFromNetworkPayload(payload: Asset): Asteroid {
        console.log("network asteroid created : " , payload);
        let asteroid = new Asteroid({
            scene: this.scene,
            opt:{}
        }, payload.id, 0, 0, payload.value[6]);
        this.asteroids[payload.id] = asteroid;
        this.updateItemFromNetworkPayload(payload);
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

    updateItemFromNetworkPayload(payload: Asset): void {
        let asteroid: Asteroid = this.asteroids[payload.id];
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

    deleteItemFromNetworkPayload(payload: Asset): void {
        console.log("network asteroid removed : " + payload.id);
        this.asteroids[payload.id].destroy();
        delete this.asteroids[payload.id];
    }
}
