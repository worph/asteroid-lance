
import {SyncRandomNumberGenerator} from "./SyncRandomNumberGenerator";

export class AssetIDGenerator{

    public static readonly ASTEROID_PREFIX:string = "asteroid/";
    public static readonly SHIP_PREFIX:string = "ship/";
    public static readonly BULLET_PREFIX:string = "bullet/";

    constructor(private random:SyncRandomNumberGenerator){
        //RandomJS random

    }

    public generateAssetID(prefixId:string):string{
        return prefixId+this.makeid(32);
    }

    private makeid(length:number):string {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let text = this.random.getRandomAPI().string(32,possible);
        /*for (let i = 0; i < length; i++) {
            text += possible.charAt(this.random.integer(0, possible.length-1));
        }*/
        return text;
    }

}