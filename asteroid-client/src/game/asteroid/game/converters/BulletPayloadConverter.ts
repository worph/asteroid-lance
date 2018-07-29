import {Identified} from "../../service/network/Asset";
import {IdentifiedConverter} from "../../service/network/AssetConverter";
import {Bullet} from "../../objects/Bullet";

interface BulletPayLoad extends Identified {
    id: string;
    pid: string;
    x: number,
    y: number,
    vx: number,
    vy: number,
    r: number,
}

export class BulletPayloadConverter implements IdentifiedConverter<Bullet> {

    createItemFromNetworkPayload(identified: Identified): Bullet {
        return undefined;
    }

    makeNetworkPayloadFromItem(bullet: Bullet): BulletPayLoad {
        return {
            id: bullet.id,
            pid: bullet.parentShipId,
            x: bullet.x,
            y: bullet.y,
            vx: bullet.velocity.x,
            vy: bullet.velocity.y,
            r: bullet.rotation,
        }
    }

    updateItemFromNetworkPayload(bullet: Bullet, payload: BulletPayLoad): void {
        bullet.setPosition(payload.x, payload.y);
        bullet.velocity.x = payload.vx;
        bullet.velocity.y = payload.vy;
        bullet.setRotation(payload.r);
    }

}
