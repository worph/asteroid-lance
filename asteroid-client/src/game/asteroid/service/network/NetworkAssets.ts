import {Asset, ASSET_ACTION, ASSET_EVENT, Identified} from "./Asset";
import * as SocketIO from "socket.io-client";

export default class NetworkAssets {
    assets: { [id: string]: any | Identified; } = {};
    private socket: any;
    private assetCreatedCallback: (asset: any | Identified) => void;
    private assetUpdatedCallback: (asset: any | Identified) => void;
    private assetDeletedCallback: (asset: any | Identified) => void;

    start(url: string) {
        this.socket = SocketIO(url, {forceNew: false});

        this.socket.on(ASSET_EVENT.INIT, (initPayload: any) => {
            this.assets = {};
            Object.keys(initPayload.assets).forEach(id => {
                this.createAssetInternal(initPayload.assets[id]);
            });
        });
        this.socket.on(ASSET_EVENT.CREATED, (asset: any | Identified) => {
            this.createAssetInternal(asset);
        });
        this.socket.on(ASSET_EVENT.UPDATED, (asset: any | Identified) => {
            this.updateAssetInternal(asset);
        });
        this.socket.on(ASSET_EVENT.DELETED, (asset: any | Identified) => {
            this.deleteAssetInternal(asset);
        });
    }

    createAssetInternal(asset) {
        this.assets[asset.id] = asset;
        this.assetCreatedCallback(asset);
    }

    updateAssetInternal(asset) {
        this.assets[asset.id] = asset;
        this.assetUpdatedCallback(asset);
    }

    deleteAssetInternal(asset) {
        delete this.assets[asset.id];
        this.assetDeletedCallback(asset);
    }

    getCurrentSocketId() {
        return this.socket.id;
    }

    createAsset(asset: any | Identified) {
        this.socket.emit(ASSET_ACTION.CREATE, asset);
    }

    createOrUpdateAsset(asset: any | Identified) {
        this.socket.emit(ASSET_ACTION.CREATE_OR_UPDATE, asset);
    }

    updateAsset(asset: any | Identified) {
        let localValue = this.assets[asset.id];
        if (JSON.stringify(asset) != JSON.stringify(localValue)) {
            this.socket.emit(ASSET_ACTION.UPDATE, asset);
        }
    }

    deleteAsset(asset: any | Identified) {
        this.socket.emit(ASSET_ACTION.DELETE, asset);
    }

    onAssetCreatedCallback(callback: (asset: any | Identified) => void) {
        this.assetCreatedCallback = callback;
    }

    onAssetUpdatedCallback(callback: (asset: any | Identified) => void) {
        this.assetUpdatedCallback = callback;
    }

    onAssetDeletedCallback(callback: (asset: any | Identified) => void) {
        this.assetDeletedCallback = callback;
    }
}