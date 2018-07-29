import {Asteroid} from "../Asteroid";
import {Asset} from "../../service/Asset";

export class AsteroidPayloadConverter {

    createNetworkPayloadFromAsteroid(asteroid: Asteroid): Asset {
        let body = asteroid;
        return {
            id: body.id,
            value: [
                body.x,//0
                body.y,//1
                body.rotation,//2
                body.velocityX,//3
                body.velocityY,//4
                body.velocityAngular,//5
                body.size]//6
        }
    }

    updateAsteroidFromNetworkPayload(asteroid: Asteroid, payload: Asset): void {
        if(asteroid==undefined){
            console.error("undefined asteroid");
            return;
        }
        let body = asteroid;
        let i:number = 0;
        body.x = payload.value[i++];//0
        body.y = payload.value[i++];//1
        body.rotation = payload.value[i++];//2
        body.velocityX = payload.value[i++];//3
        body.velocityY = payload.value[i++];//4
        body.velocityAngular = payload.value[i++];//5
        body.size = payload.value[i++];//6
    }

}
