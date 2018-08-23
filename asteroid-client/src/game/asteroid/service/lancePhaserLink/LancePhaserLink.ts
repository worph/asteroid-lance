
import {LancePhaserLinkComponent} from "./LancePhaserLinkComponent";
import {LancePhysicNetComponent} from "../../lance/LancePhysicNetComponent";
import {PhaserGraphicComponent} from "../../graphics/PhaserGraphicComponent";

export class LancePhaserLink {
    list:LancePhaserLinkComponent[] = [];

    create(graphic:PhaserGraphicComponent,physic:LancePhysicNetComponent):LancePhaserLinkComponent{
        let lancePhaserLinkComponent = new LancePhaserLinkComponent(graphic,physic);
        this.list.push(lancePhaserLinkComponent);
        return lancePhaserLinkComponent;
    }

    delete(lancePhaserLinkComponent:LancePhaserLinkComponent){

    }

    update(){
        this.list.forEach((value:LancePhaserLinkComponent)=>{
            let body = value.physic.body;
            if(body) {
                value.graphic.setPosition(body.position.x, body.position.y);
                value.graphic.setAngle(body.angle+90);//repere change
            }
        });
    }

}