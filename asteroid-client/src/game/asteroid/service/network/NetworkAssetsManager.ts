import NetworkAssets from "./NetworkAssets";
import {ASSET_ACTION, Identified} from "./Asset";
import {IdentifiedConverter} from "./AssetConverter";
import {RenderLoop} from "../RenderLoop";

export default class NetworkAssetsManager {
    registredConverter: {
        [id: string]: {
            networkAssets: NetworkAssets
            supportedPrefix: {
                [id: string]: {
                    assetConverter: IdentifiedConverter<any>
                };
            }
        };
    } = {};

    renderLoop:RenderLoop = new RenderLoop(collisionEvent => {
        this.processEvent(collisionEvent);
    });

    registerNetworkAssets(assetPrefix: string, networkAssetId: string, assetConverter: IdentifiedConverter<any>) {
        let registredListElement = this.registredConverter[networkAssetId];
        registredListElement.supportedPrefix[assetPrefix] = {
            assetConverter: assetConverter,
        }
    }

    assetAction(item: Identified, action: string) {
        Object.keys(this.registredConverter).forEach(id => {
            let registredConverterElement = this.registredConverter[id];
            let networkAssets = registredConverterElement.networkAssets;
            Object.keys(registredConverterElement.supportedPrefix).forEach(prefix => {
                if (item.id.startsWith(prefix)) {
                    let assetConverter = registredConverterElement.supportedPrefix[prefix].assetConverter;
                    let networkPayload = assetConverter.makeNetworkPayloadFromItem(item);
                    switch (action) {
                        case "createupdate":
                            networkAssets.createOrUpdateAsset(networkPayload);
                            break;
                        case "create":
                            networkAssets.createAsset(networkPayload);
                            break;
                        case "update":
                            networkAssets.updateAsset(networkPayload);
                            break;
                        case "delete":
                            networkAssets.deleteAsset(networkPayload);
                            break;
                    }
                }
            })
        })
    }

    createAsset(asset: Identified) {
        this.assetAction(asset, "create");
    }

    createOrUpdateAsset(asset: Identified) {
        this.assetAction(asset, "createupdate");
    }

    updateAsset(asset: Identified) {
        this.assetAction(asset, "update");
    }

    deleteAsset(asset: Identified) {
        this.assetAction(asset, "delete");
    }

    processEvent(networkEvent: any) {
        let type: string = networkEvent.type;
        let asset: Identified = networkEvent.asset;
        let registredListElement = networkEvent.registredListElement;

        Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
            if (asset.id.startsWith(prefix)) {
                switch (type) {
                    case "create":
                        registredListElement.supportedPrefix[prefix].assetConverter.createItemFromNetworkPayload(asset);
                        break;
                    case "update":
                        registredListElement.supportedPrefix[prefix].assetConverter.updateItemFromNetworkPayload(asset);
                        break;
                    case "delete":
                        registredListElement.supportedPrefix[prefix].assetConverter.deleteItemFromNetworkPayload(asset);
                        break;
                }
            }
        })
    }

    bootServices(apiServerAdd: any) {
        let id = apiServerAdd;
        this.registredConverter[id] = {
            networkAssets: new NetworkAssets(),
            supportedPrefix: {}
        };
        let registredListElement = this.registredConverter[id];
        registredListElement.networkAssets.onAssetCreatedCallback((asset: Identified) => {
            this.renderLoop.notifyEvent({
                type:"create",
                asset:asset,
                registredListElement:registredListElement,
            });
        });
        registredListElement.networkAssets.onAssetUpdatedCallback((asset: Identified) => {
            this.renderLoop.notifyEvent({
                type:"update",
                asset:asset,
                registredListElement:registredListElement,
            });
        });
        registredListElement.networkAssets.onAssetDeletedCallback((asset: Identified) => {
            this.renderLoop.notifyEvent({
                type:"delete",
                asset:asset,
                registredListElement:registredListElement,
            });
        });
        registredListElement.networkAssets.start(apiServerAdd);
    }

    update(){
        this.renderLoop.update();
    }

}