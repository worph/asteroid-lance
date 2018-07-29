export class Asteroid {
    id: string;
    velocityX: number;
    velocityY: number;
    velocityAngular: number;
    rotation: number;
    x: number;
    y: number;
    size: number;
    private asteroidSeed: number;

    makeid(length:number) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    constructor(x: number, y: number, size: number) {
        this.id = "asteroid/"+this.makeid(64);
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocityX = 1;
        this.velocityY = 1;
        this.velocityAngular = 0.005;
        this.rotation = 0;
        this.asteroidSeed = Math.random();
    }
}
