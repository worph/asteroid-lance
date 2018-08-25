import {PhaserGraphicComponent} from "./PhaserGraphicComponent";

export class AsteroidGraphics extends PhaserGraphicComponent {
    private currentScene: Phaser.Scene;
    private radius: number;
    private numberOfSides: number;

    public getRadius(): number {
        return this.radius;
    }

    constructor(params:GraphicsParam,radius:number,public points: {x:number,y:number}[]) {
        super(params.scene, params.opt);
        // variables
        this.currentScene = params.scene;
        this.numberOfSides = 12;
        this.radius = radius;

        this.initAsteroid(0, 0, points);

        this.currentScene.add.existing(this);
    }

    private initAsteroid(aX: number, aY: number, points: {x:number,y:number}[]): void {
        this.lineStyle(1, 0xffffff);
        for (let p = 0; p < points.length; p++) {
            this.beginPath();
            this.moveTo(points[p].x, points[p].y);
            if (p + 1 < points.length) {
                this.lineTo(points[p + 1].x, points[p + 1].y);
            } else {
                this.lineTo(points[0].x, points[0].y);
            }
            this.strokePath();
        }

        this.x = aX;
        this.y = aY;
    }
}
