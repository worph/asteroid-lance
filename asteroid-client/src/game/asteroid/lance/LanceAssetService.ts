import {LancePhysicNetComponent} from "./LancePhysicNetComponent";
import LanceGameModel from "./shared/LanceGameModel";
import LanceClientEngine from "./LanceClientEngine";
import {idService} from "../service/IDService";
import LancePhysic2DObject from "./shared/LancePhysic2DObject";
import {Service} from "../service/miniECS/Service";

export class LanceAssetService implements Service{
    constructor(public gameEngine:LanceGameModel,public clientEngine:LanceClientEngine){
    }

    createFromNetwork(value:LancePhysic2DObject):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.client = this.clientEngine;
        lancePhysicNetComponent.body = value;
        return lancePhysicNetComponent;
    }

    create(props:any,prefixId:string = "none"):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        lancePhysicNetComponent.assetId = prefixId+"/"+idService.makeidAlpha(32);
        lancePhysicNetComponent.client = this.clientEngine;
        this.clientEngine.requestObjectCreation({
            assetId:lancePhysicNetComponent.assetId,
            props:props
        },(value:LancePhysic2DObject) => {
            lancePhysicNetComponent.body = value;
        });
        return lancePhysicNetComponent;
    }


    delete(a:LancePhysicNetComponent){

    }

}