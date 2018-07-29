import {IdentifiedConverter} from "../../service/network/AssetConverter";
import {Ship} from "../../objects/Ship";
import {Identified} from "../../service/network/Asset";

interface ShipPayload extends Identified {
    id: string;
    x: number;
    y: number;
    r: number;

}

export class ShipPayloadConverter implements IdentifiedConverter<Ship> {

    makeNetworkPayloadFromItem(player: Ship): ShipPayload {
        return {
            id: player.id,
            x: player.x,
            y: player.y,
            r: player.rotation
        }
    }

    updateItemFromNetworkPayload(player: Ship, payload: ShipPayload): void {
        player.setPosition(payload.x, payload.y);
        player.setRotation(payload.r);
    }

    createItemFromNetworkPayload(identified: Identified): Ship {
        return undefined;
    }
}
