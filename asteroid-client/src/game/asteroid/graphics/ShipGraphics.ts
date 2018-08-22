import {PhaserGraphicComponent} from "./PhaserGraphicComponent";

let CONST = {
    SHIP_SIZE: 20,
    LIVES: 3,
};

export class ShipGraphics extends PhaserGraphicComponent{
    private currentScene: Phaser.Scene;

    constructor(params:GraphicsParam) {
        super(params.scene, params.opt);
        // variables
        this.currentScene = params.scene;
        // init ship
        this.initShip();
        this.currentScene.add.existing(this);
    }

    private initShip(): void {
        // define ship properties
        this.x = this.currentScene.sys.canvas.width / 2;
        this.y = this.currentScene.sys.canvas.height / 2;

        // define ship graphics and draw it
        this.lineStyle(1, 0xff0000);

        this.strokeTriangle(
            -CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            0,
            -CONST.SHIP_SIZE
        );
    }

}
