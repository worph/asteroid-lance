import {GenericObjectContainer} from "./GenericObjectContainer";

export class ShipDataModel extends GenericObjectContainer {
    state: {
        playerId: number;
        score: number;
    } = {
        playerId: -1,
        score: 0
    };


    getComponentType(): string {
        return "ShipDataModel";
    }

    read() {
        this.state = this.getData();
    }

    update() {
        this.setData(this.state);
    }

}