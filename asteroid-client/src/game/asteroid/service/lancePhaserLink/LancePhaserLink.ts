import {LancePhaserLinkComponent} from "./LancePhaserLinkComponent";
import {LancePhysicNetComponent} from "../../lance/LancePhysicNetComponent";
import {PhaserGraphicComponent} from "../../graphics/PhaserGraphicComponent";

export class LancePhaserLink {
    list: LancePhaserLinkComponent[] = [];

    create(graphic: PhaserGraphicComponent, physic: LancePhysicNetComponent): LancePhaserLinkComponent {
        let lancePhaserLinkComponent = new LancePhaserLinkComponent(graphic, physic);
        this.list.push(lancePhaserLinkComponent);
        return lancePhaserLinkComponent;
    }

    delete(lancePhaserLinkComponent: LancePhaserLinkComponent) {

    }

    update() {
        this.list.forEach((value: LancePhaserLinkComponent) => {
            let body = value.physic.body;
            if (body) {
                value.graphic.setPosition(body.position.x, body.position.y);
                //value.graphic.setAngle(body.angle+90);//repere change for dynamic object
                value.graphic.setAngle((Phaser.Math.RAD_TO_DEG * body.angle) + 90);
            }
        });
    }

    /**
     * Convert p2 physics value (meters) to pixel scale.
     * By default Phaser uses a scale of 20px per meter.
     * If you need to modify this you can over-ride these functions via the Physics Configuration object.
     *
     * @method Phaser.Physics.P2#mpx
     * @param {number} v - The value to convert.
     * @return {number} The scaled value.
     */
    mpx(v) {
        return v *= 20;
    }

    /**
     * Convert pixel value to p2 physics scale (meters).
     * By default Phaser uses a scale of 20px per meter.
     * If you need to modify this you can over-ride these functions via the Physics Configuration object.
     *
     * @method Phaser.Physics.P2#pxm
     * @param {number} v - The value to convert.
     * @return {number} The scaled value.
     */
    pxm(v) {
        return v * 0.05;
    }

    /**
     * Convert p2 physics value (meters) to pixel scale and inverses it.
     * By default Phaser uses a scale of 20px per meter.
     * If you need to modify this you can over-ride these functions via the Physics Configuration object.
     *
     * @method Phaser.Physics.P2#mpxi
     * @param {number} v - The value to convert.
     * @return {number} The scaled value.
     */
    mpxi(v) {
        return v *= -20;
    }

    /**
     * Convert pixel value to p2 physics scale (meters) and inverses it.
     * By default Phaser uses a scale of 20px per meter.
     * If you need to modify this you can over-ride these functions via the Physics Configuration object.
     *
     * @method Phaser.Physics.P2#pxmi
     * @param {number} v - The value to convert.
     * @return {number} The scaled value.
     */
    pxmi(v) {
        return v * -0.05;
    }

}