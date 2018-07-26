export class Bullet extends Phaser.GameObjects.Graphics {
    private colors: number[];
    private selectedColor: number;
    private currentScene: Phaser.Scene;
    public velocity: Phaser.Math.Vector2;
    private lifeSpan: number;
    private isOffScreen: boolean;

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
        this.velocity = new Phaser.Math.Vector2(
            15 * Math.cos(rotation - Math.PI / 2),
            15 * Math.sin(rotation - Math.PI / 2)
        );

        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);

        // physics
        this.currentScene.matter.add.gameObject(this,{ shape: { type: 'circle', radius: 3 } });
        /*this.body.allowGravity = false;
        this.body.setCircle(3);
        this.body.setOffset(-3, -3);*/
        this.currentScene.add.existing(this);
        this.getBody().setVelocity(this.velocity.x,this.velocity.y);
    }


    update(): void {
        if (this.lifeSpan < 0) {
            this.setActive(false);
        } else {
            this.lifeSpan--;
        }
    }
}
