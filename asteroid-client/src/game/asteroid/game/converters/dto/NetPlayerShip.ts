import {Identified} from "../../../service/network/Asset";

export class NetPlayerShip implements Identified{
    id:string;
    score:number=0;
    
    constructor(id: string) {
        this.id = id;
    }
}
