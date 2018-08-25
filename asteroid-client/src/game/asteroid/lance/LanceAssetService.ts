import {LancePhysicNetComponent} from "./LancePhysicNetComponent";
import LanceGameModel from "asteroid-common/dist/lance/LanceGameModel";
import LanceClientEngine from "./LanceGameModelControler";
import {idService} from "asteroid-common/dist/service/IDService";
import LancePhysic2DObject from "asteroid-common/dist/lance/LancePhysic2DObject";
import {Service} from "../service/miniECS/Service";
import {AssetIDGenerator} from "asteroid-common/dist/lance/AssetIDGenerator";

export class LanceAssetService implements Service{
    constructor(public gameEngine:LanceGameModel,public clientEngine:LanceClientEngine){
    }

    createFromNetwork(value:LancePhysic2DObject):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.client = this.clientEngine;
        lancePhysicNetComponent.body = value;
        lancePhysicNetComponent.assetId = lancePhysicNetComponent.body.assetId;
        return lancePhysicNetComponent;
    }

    create(props:any,customData:any,prefixId:string = "none"):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.assetId = AssetIDGenerator.generateAssetID(prefixId);
        lancePhysicNetComponent.client = this.clientEngine;
        this.clientEngine.requestObjectCreation({
            assetId:lancePhysicNetComponent.assetId,
            props:props
        },(value:LancePhysic2DObject) => {
            lancePhysicNetComponent.body = value;
            lancePhysicNetComponent.body.setCustomData(customData);
        });
        return lancePhysicNetComponent;
    }


    delete(a:LancePhysicNetComponent){

    }

}