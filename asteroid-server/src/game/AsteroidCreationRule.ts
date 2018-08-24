export default class AsteroidCreationRule {


    constructor(
        private worldSizeX:number,
        private worldSizeY:number,
        private callback:(position:{x:number,y:number},velocity:{x:number,y:number},rotation,velocityAngular,size,asteroidSeed)=>void) {
    }

    update(numberOfAsteroids:number): void {
        if (numberOfAsteroids === 0) {
            this.spawnAsteroids(3, 3);
        }
    }

    private spawnMiniAsteroidsOnDestruction(asteroid) {
        this.spawnAsteroids(
            3,
            asteroid.size - 1,
            asteroid.x,
            asteroid.y
        );
    }

    private createAsteroidInternal(position:{x:number,y:number},size){
            let velocityX = Math.random(); //velocity X;
            let velocityY = Math.random(); //velocity X;
            let velocityAngular = 0.005;
            let rotation = 0;
            let asteroidSeed = Math.random();
        this.callback(position,{x:velocityX,y:velocityY},rotation,velocityAngular,size,asteroidSeed);
    }

    private spawnAsteroids(
        aAmount: number,
        aSize: number,//diameter
        aX?: number,
        aY?: number
    ) {
        if (aSize > 0) {
            for (let i = 0; i < aAmount; i++) {
                let x = aX;
                let y = aY;
                if (x === undefined) {
                    x = Math.floor(Math.random() * this.worldSizeX);
                } else {
                    //random around
                    x = Math.floor(Math.random() * aSize) + aX - aSize / 2;
                }
                if (y == undefined) {
                    y = Math.floor(Math.random() * this.worldSizeY);
                } else {
                    //random around
                    y = Math.floor(Math.random() * aSize) + aY - aSize / 2;
                }
                this.createAsteroidInternal({x:x,y:y},aSize);
            }
        }
    }
}
