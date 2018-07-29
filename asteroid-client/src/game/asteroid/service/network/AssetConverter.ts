import {Asset, Identified} from "./Asset";

export interface AssetConverter<T> extends IdentifiedConverter<T>{
    createItemFromNetworkPayload(asset: Asset): T;

    makeNetworkPayloadFromItem(item: T): Asset;

    updateItemFromNetworkPayload(item: T, payload: Asset): void
}

export interface IdentifiedConverter<T> {
    createItemFromNetworkPayload(identified: Identified): T;

    makeNetworkPayloadFromItem(item: T): Identified;

    updateItemFromNetworkPayload(item: T, payload: Identified): void
}