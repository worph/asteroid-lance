import {Identified} from "../../../service/network/Asset";

export interface ShipPayload extends Identified {
    id: string;
    x: number;
    y: number;
    r: number;

}