import {idService} from "../service/IDService";

export class AssetIDGenerator{

    public static readonly ASTEROID_PREFIX:string = "asteroid/";
    public static readonly SHIP_PREFIX:string = "ship/";
    public static readonly BULLET_PREFIX:string = "bullet/";

    public static generateAssetID(prefixId:string):string{
        return prefixId+idService.makeidAlpha(32);
    }

}