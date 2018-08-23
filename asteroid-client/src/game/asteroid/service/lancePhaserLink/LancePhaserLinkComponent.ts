import {Component} from "../../service/miniECS/Component";
import {LancePhysicNetComponent} from "../../lance/LancePhysicNetComponent";
import {PhaserGraphicComponent} from "../../graphics/PhaserGraphicComponent";

export class LancePhaserLinkComponent implements Component{
    graphic:PhaserGraphicComponent;
    physic:LancePhysicNetComponent;

    constructor(graphic: PhaserGraphicComponent, physic: LancePhysicNetComponent) {
        this.graphic = graphic;
        this.physic = physic;
    }
}