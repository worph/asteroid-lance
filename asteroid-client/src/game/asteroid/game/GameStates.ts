
import LanceGameModel from "../lance/shared/LanceGameModel";

export class NetworkGameStates {
    lanceGameModel:LanceGameModel;//network + physic model
    graphics:{} = {};//graphic model
    objects:{} = {};//put gameobject?

    constructor() {
    }

    createAsset(asset: any) {
    }

    updateAsset(asset: any) {
    }

    deleteAsset(asset: any) {
    }

    onCreateAssetCallback(callback : (asset:any)=>void){

    }

    onDeleteAssetCallback(callback : (asset:any)=>void){

    }

    onUpdateAssetCallback(callback : (asset:any)=>void){

    }

}