import {Asset, Identified} from "./Asset";

export interface AssetConverter<T> extends IdentifiedConverter<T>{
    createItemFromNetworkPayload(asset: Asset): T;

    makeNetworkPayloadFromItem(item: T): Asset;

    updateItemFromNetworkPayload(payload: Asset): void

    deleteItemFromNetworkPayload(payload: Asset): void;
}

export interface IdentifiedConverter<T> {
    createItemFromNetworkPayload(payload: Identified): T;

    makeNetworkPayloadFromItem(item: T): Identified;

    updateItemFromNetworkPayload(payload: Identified): void

    deleteItemFromNetworkPayload(payload: Identified): void;
}