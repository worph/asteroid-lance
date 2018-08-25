import {PhaserGraphicComponent} from "./PhaserGraphicComponent";
import {BulletFactory} from "../objects/BulletFactory";

export class BulletGraphics extends PhaserGraphicComponent {
    private colors: number[];
    private selectedColor: number;
    private currentScene: Phaser.Scene;

    constructor(params:GraphicsParam,x:number,y:number) {
        super(params.scene, params.opt);

        // variables
        this.colors = [];
        this.colors.push(0x3ae0c4);
        this.colors.push(0x39e066);
        this.colors.push(0xe08639);
        let rndColor = Phaser.Math.RND.between(0, 2);
        this.selectedColor = this.colors[rndColor];
        this.currentScene = params.scene;

        // init bullet
        this.x = x;
        this.y = y;

        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);//TODO BulletFactory.CONST.SIZE_RADIUS

        this.currentScene.add.existing(this);
    }

}
