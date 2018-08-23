export class Bullet extends Phaser.GameObjects.Graphics {
    private colors: number[];
    private selectedColor: number;
    private currentScene: Phaser.Scene;

    constructor(params:GraphicsParam,x:number,y:number,rotation:number) {
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
        let velocity = new Phaser.Math.Vector2(
            Math.cos(rotation - Math.PI / 2),
            Math.sin(rotation - Math.PI / 2)
        );
        velocity.scale(15);
        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);
    }

}
