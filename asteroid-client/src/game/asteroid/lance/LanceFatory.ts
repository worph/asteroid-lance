import {LancePhysicNetComponent} from "./LancePhysicNetComponent";
import LanceGameModel from "./shared/LanceGameModel";
import LanceClientEngine from "./LanceClientEngine";
import {idService} from "../service/IDService";

export class LanceFatory  {
    constructor(public gameEngine:LanceGameModel,public clientEngine:LanceClientEngine){
    }

    create(props:any):LancePhysicNetComponent{
        let lancePhysicNetComponent = new LancePhysicNetComponent();
        this.clientEngine.requestObjectCreation({
            assetId:idService.makeidAlpha(64),
            props:props
        }).then(value => {
            lancePhysicNetComponent.body = value;
        });
        return lancePhysicNetComponent;
    }

    delete(a:LancePhysicNetComponent){

    }

}