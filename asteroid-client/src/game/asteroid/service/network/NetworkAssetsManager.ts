import NetworkAssets from "./NetworkAssets";
import {Identified} from "./Asset";
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

    /*bootServices(apiServerAdd: any) {
        let id = "broadcasterService";
        let registredListElement = this.registredConverter[id];
        this.broadcasterService.onAssetCreatedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    registredListElement.supportedPrefix[prefix].assetConverter.createItemFromNetworkPayload(asset);
                }
            })
        });
        this.broadcasterService.onAssetUpdatedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    //TODO asset updated so we read it from the network
                    registredListElement.supportedPrefix[prefix].assetConverter.updateItemFromNetworkPayload(asset);
                }
            })
        });
        this.broadcasterService.onAssetDeletedCallback((asset:Identified) => {
            Object.keys(registredListElement.supportedPrefix).forEach(prefix => {
                if(asset.id.startsWith(prefix)){
                    registredListElement.supportedPrefix[prefix].assetConverter.deleteItemFromNetworkPayload(asset);
                }
            })
        });
        this.broadcasterService.start(apiServerAdd+"/broadcaster");
        this.broadcasterService.createAsset(this.shipPayloadConverter.makeNetworkPayloadFromItem(this.player));
    }*/

}