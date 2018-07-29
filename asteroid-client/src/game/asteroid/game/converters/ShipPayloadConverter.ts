import {IdentifiedConverter} from "../../service/network/AssetConverter";
import {Ship} from "../../objects/Ship";
import {Identified} from "../../service/network/Asset";
import {throws} from "assert";

interface ShipPayload extends Identified {
    id: string;
    x: number;
    y: number;
    r: number;

}

export class ShipPayloadConverter implements IdentifiedConverter<Ship> {
    private scene: Phaser.Scene;
    private player: Ship;
    private otherPlayer: { [id: string]: Ship; };

    constructor(scene: Phaser.Scene, player: Ship, otherPlayer: { [p: string]: Ship }) {
        this.scene = scene;
        this.player = player;
        this.otherPlayer = otherPlayer;
    }

    createItemFromNetworkPayload(payload: ShipPayload): Ship {
        if (this.player.id !== payload.id) {
            console.log("network player added : " + payload.id);
            this.otherPlayer[payload.id] = (new Ship({scene: this.scene, opt: {}}, payload.id, false));
            this.updateItemFromNetworkPayload(payload);
            return this.otherPlayer[payload.id];
        } else {
            throw new Error("local player added");
        }
    }

    makeNetworkPayloadFromItem(player: Ship): ShipPayload {
        return {
            id: player.id,
            x: player.x,
            y: player.y,
            r: player.rotation
        }
    }

    updateItemFromNetworkPayload(payload: ShipPayload): void {
        if (this.player.id !== payload.id) {
            let player: Ship = this.otherPlayer[payload.id];
            player.setPosition(payload.x, payload.y);
            player.setRotation(payload.r);
        } else {
            //we also receive position of local player as percieved by the other => but we don't care
            throw new Error();
        }
    }

    deleteItemFromNetworkPayload(payload: Identified): void {
        if (this.player.id !== payload.id) {
            console.log("network player removed : " + payload.id);
            this.otherPlayer[payload.id].destroy();
            delete this.otherPlayer[payload.id];
        } else {
            throw new Error();
        }
    }

}
