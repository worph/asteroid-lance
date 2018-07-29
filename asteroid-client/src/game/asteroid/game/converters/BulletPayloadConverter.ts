import {IdentifiedConverter} from "../../service/network/AssetConverter";
import {Bullet} from "../../objects/Bullet";
import {Ship} from "../../objects/Ship";
import {BulletPayLoad} from "./dto/BulletPayLoad";

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
            if (ship == undefined) {
                console.error("ship undefined");
            } else {
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
        let body = bullet.getBody();
        return {
            id: bullet.id,
            pid: bullet.parentShipId,
            x: body.x,
            y: body.y,
            vx: body.body.velocity.x,
            vy: body.body.velocity.y,
            r: body.rotation,
        }
    }

    updateItemFromNetworkPayload(payload: BulletPayLoad): void {
        if (this.player.id === payload.id) {
            let ship = this.otherPlayer[payload.pid];
            let bullet: Bullet = ship.getBullets()[payload.id];
            let body = bullet.getBody();
            body.setPosition(payload.x, payload.y);
            body.setVelocity(payload.vx,payload.vy);
            body.setRotation(payload.r);
        } else {
            console.log(this.player);
            console.log(payload);
            console.error("bullet update ignored");
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
