import {LancePhysicNetComponent} from "./LancePhysicNetComponent";
import LanceGameModel from "./shared/LanceGameModel";
import LanceClientEngine from "./LanceClientEngine";
import {idService} from "../service/IDService";
import LanceAsset from "./shared/LanceAsset";
import {Service} from "../service/miniECS/Service";

export class LanceAssetService implements Service{
    constructor(public gameEngine:LanceGameModel,public clientEngine:LanceClientEngine){
    }

    createFromNetwork(value:LanceAsset):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.client = this.clientEngine;
        lancePhysicNetComponent.body = value;
        return lancePhysicNetComponent;
    }

    create(props:any,prefixId:string = "none"):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.client = this.clientEngine;
        this.clientEngine.requestObjectCreation({
            assetId:prefixId+"/"+idService.makeidAlpha(32),
            props:props
        }).then((value:LanceAsset) => {
            lancePhysicNetComponent.body = value;
        });
        return lancePhysicNetComponent;
    }


    delete(a:LancePhysicNetComponent){

    }

}