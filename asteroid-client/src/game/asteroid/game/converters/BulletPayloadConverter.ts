import {Identified} from "../../service/network/Asset";
import {IdentifiedConverter} from "../../service/network/AssetConverter";
import {Bullet} from "../../objects/Bullet";
import {Ship} from "../../objects/Ship";

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
    private player: Ship;
    private otherPlayer: { [id: string]: Ship; };

    constructor(player: Ship, otherPlayer: { [p: string]: Ship }) {
        this.player = player;
        this.otherPlayer = otherPlayer;
    }

    createItemFromNetworkPayload(payload: BulletPayLoad): Bullet {
        let id = payload.pid;
        console.log("bullet : " + id);
        if (this.player.id !== id) {
            let ship = this.otherPlayer[id];
            if(ship==undefined){
                console.error("ship undefined");
            }else {
                ship.createBullet(payload.id, payload.x, payload.y, payload.r);
                this.updateItemFromNetworkPayload(payload);//TODO refactoring needed djv
                let bullet: Bullet = ship.getBullets()[payload.id];
                return bullet;
            }
        } else {
            throw new Error("local player updated");
        }
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

    updateItemFromNetworkPayload(payload: BulletPayLoad): void {
        if (this.player.id === payload.id) {
            let ship = this.otherPlayer[payload.pid];
            let bullet: Bullet = ship.getBullets()[payload.id];
            bullet.setPosition(payload.x, payload.y);
            bullet.velocity.x = payload.vx;
            bullet.velocity.y = payload.vy;
            bullet.setRotation(payload.r);
        }else{
            throw new Error();
        }
    }

    deleteItemFromNetworkPayload(payload: BulletPayLoad): void {
        let id = payload.pid;
        if (this.player.id !== id) {
            let ship = this.otherPlayer[id];
            ship.deleteBullet(payload.id);
        } else {
            throw new Error("local player updated");
        }
    }

}
