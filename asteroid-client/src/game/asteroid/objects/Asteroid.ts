import {CONST} from "../const/const";

export class Asteroid extends Phaser.GameObjects.Graphics {
    private currentScene: Phaser.Scene;
    private radius: number;
    private asteroidRadius: number;
    private sizeOfAsteroid: number;
    private numberOfSides: number;

    public getRadius(): number {
        return this.radius;
    }

    public getBody(): any {
        return this.body;
    }

    constructor(params,public id:string) {
        super(params.scene, params);
        console.log(this.body);

        // variables
        this.currentScene = params.scene;
        this.numberOfSides = 12;
        this.asteroidRadius = 0;
        this.sizeOfAsteroid = params.size;

        // init ship
        this.initAsteroid(params.x, params.y, this.sizeOfAsteroid);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.body.allowGravity = false;
        this.body.setCircle(this.asteroidRadius);
        this.body.setOffset(-this.asteroidRadius, -this.asteroidRadius);

        this.currentScene.add.existing(this);
    }

    private initAsteroid(aX: number, aY: number, aSizeOfAsteroid: number): void {
        let points: Phaser.Math.Vector2[] = [];

        for (let i = 0; i < this.numberOfSides; i++) {
            switch (aSizeOfAsteroid) {
                case 3: {
                    this.radius = Phaser.Math.RND.between(
                        CONST.ASTEROID.LARGE.MAXSIZE,
                        CONST.ASTEROID.LARGE.MINSIZE
                    );
                    break;
                }

                case 2: {
                    this.radius = Phaser.Math.RND.between(
                        CONST.ASTEROID.MEDIUM.MAXSIZE,
                        CONST.ASTEROID.MEDIUM.MINSIZE
                    );
                    break;
                }

                case 1: {
                    this.radius = Phaser.Math.RND.between(
                        CONST.ASTEROID.SMALL.MAXSIZE,
                        CONST.ASTEROID.SMALL.MINSIZE
                    );
                    break;
                }
            }
            if (this.radius > this.asteroidRadius) {
                this.asteroidRadius = this.radius;
            }
            let x = this.radius * Math.cos(2 * Math.PI * i / this.numberOfSides);
            let y = this.radius * Math.sin(2 * Math.PI * i / this.numberOfSides);

            points.push(new Phaser.Math.Vector2(x, y));
        }

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

    update(): void {
    }

    public getSize(): number {
        return this.sizeOfAsteroid;
    }

    private getRandomVelocity(aMin: number, aMax: number): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            Phaser.Math.RND.between(
                this.getRndNumber(aMin, aMax),
                this.getRndNumber(aMin, aMax)
            ),
            Phaser.Math.RND.between(
                this.getRndNumber(aMin, aMax),
                this.getRndNumber(aMin, aMax)
            )
        );
    }

    private getRndNumber(aMin: number, aMax: number): number {
        let num = Math.floor(Math.random() * aMax) + aMin;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return num;
    }
}
