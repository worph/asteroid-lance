import {LancePhaserLinkComponent} from "./LancePhaserLinkComponent";
import {PhaserGraphicComponent} from "../../graphics/PhaserGraphicComponent";
import LancePhysic2DObject from "asteroid-common/dist/lance/component/LancePhysic2DObject";

export class LancePhaserLink {
    list: LancePhaserLinkComponent[] = [];

    create(graphic: PhaserGraphicComponent, physic: LancePhysic2DObject): LancePhaserLinkComponent {
        let lancePhaserLinkComponent = new LancePhaserLinkComponent(graphic, physic);
        this.list.push(lancePhaserLinkComponent);
        return lancePhaserLinkComponent;
    }

    delete(lancePhaserLinkComponent: LancePhaserLinkComponent) {

    }

    update() {
        this.list.forEach((value: LancePhaserLinkComponent) => {
            let body = value.physic;
            if (body) {
                value.graphic.setPosition(body.position.x, body.position.y);
                //value.graphic.setAngle(body.angle+90);//repere change for dynamic object
                value.graphic.setAngle((Phaser.Math.RAD_TO_DEG * body.angle) + 90);
            }
        });
    }

}