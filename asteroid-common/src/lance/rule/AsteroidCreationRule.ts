import LanceGameModel from "../LanceGameModel";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {AssetIDGenerator} from "../AssetIDGenerator";
import {AsteroidFactory} from "../object/AsteroidFactory";
import {LanceNetworkEntity} from "../ecs/LanceNetworkEntity";

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

export interface AsteroidCreationData{
    position:{x:number,y:number},
    velocity:{x:number,y:number},
    rotation:number,
    velocityAngular:number,
    sizeOrder:number,
    radius:number,
    points:{x:number,y:number}[],
    asteroidSeed:number
}

export default class AsteroidCreationRule {

    callback:(data:AsteroidCreationData)=>void;

    constructor(
        private worldSizeX:number,
        private worldSizeY:number,
        private gameModel:LanceGameModel,
        private asteroidFactory:AsteroidFactory) {
        this.callback = (data) => {
            this.asteroidFactory.create(data);
        };
    }

    update(): void {
        let keys = Object.keys(this.gameModel.world.objects);
        let asteroidCount = 0;
        keys.forEach((key, index, array) => {
            let object = this.gameModel.world.objects[key];
            if(object instanceof LanceNetworkEntity){
                let asset = object as LanceNetworkEntity;
                if(asset.entityId.startsWith(AssetIDGenerator.ASTEROID_PREFIX)){
                    asteroidCount++;
                }
            }
        });
        if (asteroidCount === 0) {
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

    private getRndNumber(aMin: number, aMax: number): number {
        let num = Math.floor(Math.random() * (aMax-aMin)) + aMin;
        return num;
    }

    private createAsteroidInternal(position:{x:number,y:number},sizeOrder){
            let velocityX = Math.random(); //velocity X;
            let velocityY = Math.random(); //velocity X;
            let velocityAngular = 0.005;
            let rotation = 0;
            let asteroidSeed = Math.random();

        let numberOfSides = 12;
        let asteroidRadius = 0;
        let points = [];
        for (let i = 0; i < numberOfSides; i++) {
            let radius = 0;
            switch (sizeOrder) {
                case 3: {
                    radius = this.getRndNumber(
                        CONST.ASTEROID.LARGE.MAXSIZE,
                        CONST.ASTEROID.LARGE.MINSIZE
                    );
                    break;
                }

                case 2: {
                    radius = this.getRndNumber(
                        CONST.ASTEROID.MEDIUM.MAXSIZE,
                        CONST.ASTEROID.MEDIUM.MINSIZE
                    );
                    break;
                }

                case 1: {
                    radius = this.getRndNumber(
                        CONST.ASTEROID.SMALL.MAXSIZE,
                        CONST.ASTEROID.SMALL.MINSIZE
                    );
                    break;
                }
            }
            if (radius > asteroidRadius) {
                asteroidRadius = radius;
            }
            let x = radius * Math.cos(2 * Math.PI * i / numberOfSides);
            let y = radius * Math.sin(2 * Math.PI * i / numberOfSides);

            points.push({x:x, y:y});
        }
        let data1:AsteroidCreationData = {
            position:position,
            velocity:{x:velocityX,y:velocityY},
            rotation:rotation,
            velocityAngular:velocityAngular,
            sizeOrder:sizeOrder,
            asteroidSeed:asteroidSeed,
            points:points,
            radius:asteroidRadius
        };
        this.callback(data1);
    }

    private spawnAsteroids(
        amount: number,
        sizeOrder: number,//diameter
        aX?: number,
        aY?: number
    ) {
        if (sizeOrder > 0) {
            for (let i = 0; i < amount; i++) {
                let x = aX;
                let y = aY;
                if (x === undefined) {
                    x = Math.floor(Math.random() * this.worldSizeX);
                } else {
                    //random around
                    x = Math.floor(Math.random() * sizeOrder) + aX - sizeOrder / 2;
                }
                if (y == undefined) {
                    y = Math.floor(Math.random() * this.worldSizeY);
                } else {
                    //random around
                    y = Math.floor(Math.random() * sizeOrder) + aY - sizeOrder / 2;
                }
                this.createAsteroidInternal({x:x,y:y},sizeOrder);
            }
        }
    }
}
