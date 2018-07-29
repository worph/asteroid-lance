import {Identified} from "../../../service/Asset";

export interface BulletPayLoad extends Identified {
    id: string;
    pid: string;
    x: number,
    y: number,
    vx: number,
    vy: number,
    r: number,
}