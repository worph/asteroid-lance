import {Identified} from "../service/miniECS/Identified";

export class Bullet extends Phaser.GameObjects.Graphics implements Identified {
    private colors: number[];
    private selectedColor: number;
    private currentScene: Phaser.Scene;
    private lifeSpan: number;
    private isOffScreen: boolean;
    static readonly ID_PREFIX: string = "bullet/";

    public getBody():  Phaser.Physics.Matter.Image {
        let ret : any = this;
        return ret;
    }

    constructor(params:GraphicsParam,x:number,y:number,rotation:number,public id:string,public parentShipId:string) {
        super(params.scene, params.opt);

        // variables
        this.colors = [];
        this.colors.push(0x3ae0c4);
        this.colors.push(0x39e066);
        this.colors.push(0xe08639);
        let rndColor = Phaser.Math.RND.between(0, 2);
        this.selectedColor = this.colors[rndColor];
        this.currentScene = params.scene;
        this.lifeSpan = 100;
        this.isOffScreen = false;

        // init bullet
        this.x = x;
        this.y = y;
        let velocity = new Phaser.Math.Vector2(
            Math.cos(rotation - Math.PI / 2),
            Math.sin(rotation - Math.PI / 2)
        );
        velocity.scale(15);
        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);

        // physics
        this.currentScene.matter.add.gameObject(this,{ shape: { type: 'circle', radius: 3 } });
        /*this.body.allowGravity = false;
        this.body.setCircle(3);
        this.body.setOffset(-3, -3);*/
        this.currentScene.add.existing(this);
        this.getBody().setFriction(0,0,0);
        this.getBody().setIgnoreGravity(true);
        this.getBody().setBounce(1);
        this.getBody().setVelocity(velocity.x,velocity.y);
    }


    update(): void {
        if (this.lifeSpan < 0) {
            this.setActive(false);
        } else {
            this.lifeSpan--;
        }
    }
}
