import DistributedAssetsLocator from "../service/DistributedAssetsLocator";
import BroadcasterService from "../service/BroadcasterService";
import {Asset, ASSET_EVENT} from "../service/Asset";
import {Asteroid} from "./Asteroid";
import {Ship} from "./Ship";

import * as SocketIO from "socket.io";
import * as express from 'express';

export default class AsteroGame {

    playerShip: { [id: string]: Ship; } = {};
    asteroids: { [id: string]: Asteroid; } = {};
    private numberOfAsteroids: number = 3;
    private worldSizeX: number = 1000;
    private worldSizeY: number = 1000;
    stepTimeMs: number = 1000;//millisecond
    distributedAssetLocator: DistributedAssetsLocator;
    io: SocketIO.Server;
    private expressApp: any;

    update(): void {
        //console.log(Object.keys(this.asteroids));
        if (Object.keys(this.asteroids).length === 0) {
            this.spawnAsteroids(this.numberOfAsteroids, 3);
        }
        /*Object.keys(this.io.of('/').connected).forEach(socketId=>{
           console.log(socketId);
        });*/
    }

    private spawnMiniAsteroidsOnDestruction(asteroid) {
        this.spawnAsteroids(
            3,
            asteroid.size - 1,
            asteroid.x,
            asteroid.y
        );
    }

    private spawnAsteroids(
        aAmount: number,
        aSize: number,
        aX?: number,
        aY?: number
    ) {
        if (aSize > 0) {
            for (let i = 0; i < aAmount; i++) {
                let x = aX;
                let y = aY;
                if (x === undefined) {
                    x = Math.floor(Math.random() * this.worldSizeX);
                }
                if (y == undefined) {
                    y = Math.floor(Math.random() * this.worldSizeY);
                }
                let asteroid = new Asteroid(x, y, aSize);
                this.asteroids[asteroid.id] = asteroid;
                this.distributedAssetLocator.createAsset({
                    id: asteroid.id,
                    value: [x,
                        y,
                        Math.random()*100,
                        Math.random()*100,
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        0,
                        0.05,
                        aSize]
                }, undefined);
            }
        }
    }

    start(io: SocketIO.Server,expressApp:any, distributedAssetLocator: DistributedAssetsLocator, broadcastService: BroadcasterService) {
        this.io = io.of('/asteroid');
        this.expressApp = expressApp;
        this.distributedAssetLocator = distributedAssetLocator;
        distributedAssetLocator.on(ASSET_EVENT.DELETED, (asset:Asset) => {
            console.log("delete => "+asset.id);
            if(asset.id.startsWith("asteroid/")){
                if(this.asteroids[asset.id]==undefined){
                    console.error("undefined id");
                }else {
                    let asteroid = this.asteroids[asset.id];
                    asteroid.x = asset.value[0];
                    asteroid.y = asset.value[1];
                    this.spawnMiniAsteroidsOnDestruction(asteroid);
                    delete this.asteroids[asset.id];
                }
            }
        });

        this.io.on('connection', (socket) => {
            console.log('a user connected: ', socket.id);

            // when a player disconnects, remove them from our players object
            socket.on('playership', (data) => {
                console.log('playership: ', data);
                this.playerShip[socket.id] = new Ship(data);
            });

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id);
                if(this.playerShip[socket.id]!=undefined) {
                    distributedAssetLocator.deleteAsset({id: this.playerShip[socket.id].id, value: []}, undefined);
                    broadcastService.deleteAsset({
                        id: this.playerShip[socket.id].id
                    },undefined);
                    delete this.playerShip[socket.id];
                }
            });
        });

        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                game: 'Asteroid!',
                numberOfAsteroids: this.numberOfAsteroids,
                worldSizeX: this.worldSizeX,
                worldSizeY: this.worldSizeY,
                stepTimeMs: this.stepTimeMs,
            })
        });
        this.expressApp.use('/asteroid-game', router)

        //set up main update
        setInterval(() => {
            this.update()
        }, this.stepTimeMs);
        this.update();
    }
}
