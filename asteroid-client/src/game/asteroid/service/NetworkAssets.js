"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("./Asset");
const SocketIO = require("socket.io-client");
class NetworkAssets {
    constructor() {
        this.assets = {};
        this.pause = false;
        this.queueEvent = [];
    }
    start(url) {
        this.socket = SocketIO(url, { forceNew: true });
        this.socket.on(Asset_1.ASSET_EVENT.INIT, (initPayload) => {
            this.assets = {};
            Object.keys(initPayload.assets).forEach(id => {
                this.createAssetInternal(initPayload.assets[id]);
            });
        });
        this.socket.on(Asset_1.ASSET_EVENT.CREATED, (asset) => {
            if (this.pause) {
                this.queueEvent.push({ event: Asset_1.ASSET_EVENT.CREATED, data: asset });
            }
            else {
                this.createAssetInternal(asset);
            }
        });
        this.socket.on(Asset_1.ASSET_EVENT.UPDATED, (asset) => {
            if (this.pause) {
                this.queueEvent.push({ event: Asset_1.ASSET_EVENT.UPDATED, data: asset });
            }
            else {
                this.updateAssetInternal(asset);
            }
        });
        this.socket.on(Asset_1.ASSET_EVENT.DELETED, (asset) => {
            if (this.pause) {
                this.queueEvent.push({ event: Asset_1.ASSET_EVENT.DELETED, data: asset });
            }
            else {
                this.deleteAssetInternal(asset);
            }
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
    setPause(pause) {
        if (!pause) {
            this.queueEvent.forEach(value => {
                switch (value.event) {
                    case Asset_1.ASSET_EVENT.CREATED:
                        this.createAssetInternal(value.data);
                        break;
                    case Asset_1.ASSET_EVENT.UPDATED:
                        this.updateAssetInternal(value.data);
                        break;
                    case Asset_1.ASSET_EVENT.DELETED:
                        this.deleteAssetInternal(value.data);
                        break;
                }
            });
        }
        this.pause = pause;
    }
    getCurrentSocketId() {
        return this.socket.id;
    }
    createAsset(asset) {
        this.socket.emit(Asset_1.ASSET_ACTION.CREATE, asset);
    }
    createOrUpdateAsset(asset) {
        this.socket.emit(Asset_1.ASSET_ACTION.CREATE_OR_UPDATE, asset);
    }
    updateAsset(asset) {
        let localValue = this.assets[asset.id];
        if (JSON.stringify(asset) != JSON.stringify(localValue)) {
            this.socket.emit(Asset_1.ASSET_ACTION.UPDATE, asset);
        }
    }
    deleteAsset(asset) {
        this.socket.emit(Asset_1.ASSET_ACTION.DELETE, asset);
    }
    onAssetCreatedCallback(callback) {
        this.assetCreatedCallback = callback;
    }
    onAssetUpdatedCallback(callback) {
        this.assetUpdatedCallback = callback;
    }
    onAssetDeletedCallback(callback) {
        this.assetDeletedCallback = callback;
    }
}
exports.default = NetworkAssets;
