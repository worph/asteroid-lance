import {Component} from "asteroid-common/dist/miniECS/Component";
import {PhaserGraphicComponent} from "../../graphics/PhaserGraphicComponent";
import LancePhysic2DObject from "asteroid-common/dist/lance/component/LancePhysic2DObject";

export class LancePhaserLinkComponent implements Component{
    getComponentType(): string {
        return "LancePhaserLinkComponent";
    }

    graphic:PhaserGraphicComponent;
    physic:LancePhysic2DObject;

    constructor(graphic: PhaserGraphicComponent, physic: LancePhysic2DObject) {
        this.graphic = graphic;
        this.physic = physic;
    }
}