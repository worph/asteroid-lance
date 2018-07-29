import {Identified} from "../../../service/Asset";

export interface ShipPayload extends Identified {
    id: string;
    x: number;
    y: number;
    r: number;

}