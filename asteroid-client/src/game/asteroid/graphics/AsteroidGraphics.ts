let CONST = {
    ASTEROID_COUNT: 3,
    ASTEROID: {
        LARGE: {
            MAXSIZE: 100,
            MINSIZE: 50,
            MAXSPEED: 3,
            MINSPEED: 1
        },
        MEDIUM: {
            MAXSIZE: 50,
            MINSIZE: 30,
            MAXSPEED: 4,
            MINSPEED: 1
        },
        SMALL: {
            MAXSIZE: 30,
            MINSIZE: 10,
            MAXSPEED: 4,
            MINSPEED: 2
        }
    }
};

export class AsteroidGraphics extends Phaser.GameObjects.Graphics {
    private currentScene: Phaser.Scene;
    private radius: number;
    private asteroidRadius: number;
    private sizeOfAsteroid: number;
    private numberOfSides: number;

    public getRadius(): number {
        return this.radius;
    }

    constructor(params:GraphicsParam,x:number,y:number,size:number) {
        super(params.scene, params.opt);
        // variables
        this.currentScene = params.scene;
        this.numberOfSides = 12;
        this.asteroidRadius = 0;
        this.sizeOfAsteroid = size;

        this.initAsteroid(x, y, this.sizeOfAsteroid);

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

    public getSize(): number {
        return this.sizeOfAsteroid;
    }

    private getRndNumber(aMin: number, aMax: number): number {
        let num = Math.floor(Math.random() * aMax) + aMin;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return num;
    }
}