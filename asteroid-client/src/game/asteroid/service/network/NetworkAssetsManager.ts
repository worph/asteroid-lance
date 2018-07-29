import NetworkAssets from "./NetworkAssets";
import {ASSET_ACTION, Identified} from "./Asset";
import {IdentifiedConverter} from "./AssetConverter";

export default class NetworkAssetsManager{
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

    registerNetworkAssets(assetPrefix:string,networkAssetId:string,assetConverter:IdentifiedConverter<any>){
        let registredListElement = this.registredConverter[networkAssetId];
        registredListElement.supportedPrefix[assetPrefix]={
            assetConverter:assetConverter,
        }
    }

    assetAction(item: Identified,action:string) {
        Object.keys(this.registredConverter).forEach(id => {
            let registredConverterElement = this.registredConverter[id];
            let networkAssets = registredConverterElement.networkAssets;
            Object.keys(registredConverterElement.supportedPrefix).forEach(prefix => {
                if(item.id.startsWith(prefix)){
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
        this.assetAction(asset,"create");
    }

    createOrUpdateAsset(asset: Identified) {
        this.assetAction(asset,"createupdate");
    }

    updateAsset(asset: Identified) {
        this.assetAction(asset,"update");
    }

    deleteAsset(asset: Identified) {
        this.assetAction(asset,"delete");
    }

    bootServices(apiServerAdd: any) {
        let id = apiServerAdd;
        this.registredConverter[id] = {
            networkAssets:new NetworkAssets(),
            supportedPrefix:{}
        };
        let registredListElement = this.registredConverter[id];
        registredListElement.networkAssets.onAssetCreatedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    registredListElement.supportedPrefix[prefix].assetConverter.createItemFromNetworkPayload(asset);
                }
            })
        });
        registredListElement.networkAssets.onAssetUpdatedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    //TODO asset updated so we read it from the network
                    registredListElement.supportedPrefix[prefix].assetConverter.updateItemFromNetworkPayload(asset);
                }
            })
        });
        registredListElement.networkAssets.onAssetDeletedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    registredListElement.supportedPrefix[prefix].assetConverter.deleteItemFromNetworkPayload(asset);
                }
            })
        });
        registredListElement.networkAssets.start(apiServerAdd);
    }

}