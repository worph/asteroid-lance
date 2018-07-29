export interface Identified {
    id: string
}

class ImmutableIdentified implements Identified{
    readonly id = "";
}

export const IDENTIFIED_NO_VALUE: ImmutableIdentified = Object.freeze(new ImmutableIdentified());

export interface Asset extends Identified{
    value: number[]
}

export class ASSET_EVENT{
    static readonly CREATED:string = "assetCreated";
    static readonly UPDATED:string = "assetUpdated";
    static readonly DELETED:string = "assetDeleted";
    static readonly INIT:string = "initAssets";
}

export class ASSET_ACTION{
    static readonly CREATE_OR_UPDATE:string = "createOrUpdateAsset";
    static readonly CREATE:string = "createAsset";
    static readonly UPDATE:string = "updateAsset";
    static readonly DELETE:string = "deleteAsset";
}