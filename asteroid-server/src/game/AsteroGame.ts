import DistributedAssetsLocator from "../service/DistributedAssetsLocator";
import BroadcasterService from "../service/BroadcasterService";
import {Asset, ASSET_EVENT} from "../service/Asset";
import {Asteroid} from "./Asteroid";
import {NetPlayerShip} from "./converters/dto/NetPlayerShip";

import * as SocketIO from "socket.io";
import * as express from 'express';
import {AsteroidPayloadConverter} from "./converters/AsteroidPayloadConverter";
import {BulletPayLoad} from "./converters/dto/BulletPayLoad";
import {ShipPayload} from "./converters/dto/ShipPayload";

interface NVMFormat {
    scores: { [id: string]: number; }
}

export default class AsteroGame {
    nvm: NVMFormat = {
        scores: {}
    };
    playerShip: { [id: string]: NetPlayerShip; } = {}; // id => socket.id
    asteroids: { [id: string]: Asteroid; } = {}; // id => asteroid asset id

    private numberOfAsteroids: number = 3;
    private worldSizeX: number = 1920;
    private worldSizeY: number = 1920;
    stepTimeMs: number = 1000;//millisecond
    distributedAssetLocator: DistributedAssetsLocator;
    private broadcastService: BroadcasterService;
    io: SocketIO.Server;
    private expressApp: any;
    static readonly PLAYERSHIP_NOTIFY: string = "playership";
    public asteroidPayloadConverter: AsteroidPayloadConverter = new AsteroidPayloadConverter();

    start(io: SocketIO.Server, expressApp: any, distributedAssetLocator: DistributedAssetsLocator, broadcastService: BroadcasterService) {
        this.io = io.of('/asteroid');
        this.expressApp = expressApp;
        this.distributedAssetLocator = distributedAssetLocator;
        this.broadcastService = broadcastService;

        //////////////////////////////////////////////////////////
        distributedAssetLocator.on(ASSET_EVENT.DELETED, (asset: Asset) => {
            console.log("delete => " + asset.id);
            if (asset.id.startsWith("asteroid/")) {
                if (this.asteroids[asset.id] == undefined) {
                    console.error("undefined id");
                } else {
                    let asteroid = this.asteroids[asset.id];
                    asteroid.x = asset.value[0];
                    asteroid.y = asset.value[1];
                    this.spawnMiniAsteroidsOnDestruction(asteroid);
                    delete this.asteroids[asset.id];
                }
            }
        });

        /////////////////////////////////////////////
        //Set up socket listener
        /////////////////////////////////////////////
        this.io.on('connection', (socket) => {
            console.log('a user connected: ', socket.id);
            this.removeOrphanBullet();

            // when a player disconnects, remove them from our players object
            socket.on(AsteroGame.PLAYERSHIP_NOTIFY, (data: { id: string, name: string }) => {
                this.playerShip[socket.id] = new NetPlayerShip(data.id, data.name);
            });

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id);
                if (this.playerShip[socket.id] != undefined) {
                    distributedAssetLocator.deleteAsset({id: this.playerShip[socket.id].id, value: []}, undefined);
                    broadcastService.deleteAsset({
                        id: this.playerShip[socket.id].id
                    }, undefined);
                    delete this.playerShip[socket.id];
                    this.removeOrphanBullet();
                }
            });
        });

        ///////////////////////////////////////////////////
        //Setup game REST API
        ///////////////////////////////////////////////////
        const router = express.Router();
        router.get('/info', (req, res) => {
            res.json({
                game: 'Asteroid!',
                numberOfAsteroids: this.numberOfAsteroids,
                worldSizeX: this.worldSizeX,
                worldSizeY: this.worldSizeY,
                stepTimeMs: this.stepTimeMs,
            })
        });
        router.get('/players', (req, res) => {
            res.json(this.playerShip)
        });
        router.get('/scores', (req, res) => {
            let ret = {};
            Object.keys(this.playerShip).forEach(key => {
                let playerShip: NetPlayerShip = this.playerShip[key];
                ret[playerShip.name] = playerShip.currentScore;
            });
            res.json(ret)
        });
        router.get('/highscores', (req, res) => {
            res.json(this.nvm.scores)
        });

        router.get('/isplaying', (req, res) => {
            let name = req.query.player;
            let result: any = {}
            result.result=false;
            Object.keys(this.playerShip).forEach(key => {
                let playerShip: NetPlayerShip = this.playerShip[key];
                if (playerShip.name === name) {
                    result.result=true;
                }
            });
            res.json(result)
        });

        router.get('/notify_end_game', (req, res) => {
            let playerId = req.query.player;
            let result: any = {}
            Object.keys(this.playerShip).forEach(key => {
                let playerShip: NetPlayerShip = this.playerShip[key];
                //store score in NVM
                if (playerShip.id === playerId) {
                    if (this.nvm.scores[playerShip.name] == undefined) {
                        this.nvm.scores[playerShip.name] = 0;
                    }
                    let highScore = (playerShip.currentScore > this.nvm.scores[playerShip.name]) && playerShip.currentScore!==0;
                    if (highScore) {
                        this.nvm.scores[playerShip.name] = playerShip.currentScore;
                    }
                    result.currentScore = playerShip.currentScore;
                    result.highScore = this.nvm.scores[playerShip.name];
                    result.isHighScore = highScore;
                }
            });
            res.json(result)
        });

        router.get('/notify_score', (req, res) => {
            let asteroid = req.query.asteroid;
            let asteroidsize = req.query.asteroidsize;
            let player = req.query.player;
            Object.keys(this.playerShip).forEach(key => {
                let playerShip: NetPlayerShip = this.playerShip[key];
                //store score in NVM
                if (playerShip.id === player) {
                    switch (asteroidsize) {
                        case '3':
                            playerShip.currentScore += 20;
                            break;
                        case '2':
                            playerShip.currentScore += 50;
                            break;
                        case '1':
                            playerShip.currentScore += 100;
                            break;
                    }
                    //network notify score
                    this.io.emit("score", {id: playerShip.id, data: playerShip.currentScore});

                }
            });
            res.json({
                ok: 'ok',
            })
        });

        router.get('/matchmaker', (req, res) => {
            //let finalurl = req.protocol + '://' + req.get('host')+"/socket.io/lance";
            let finalurl = req.protocol + '://' + req.get('host')+"/socket.io";
            res.json({ serverURL: finalurl, status: 'ok' })
        });

        this.expressApp.use('/asteroid-game', router);

        /////////////////////////////////////////////
        //set up main update
        /////////////////////////////////////////////
        setInterval(() => {
            this.update()
        }, this.stepTimeMs);
        this.update();
    }


    removeOrphanBullet() {
        //clean up player ship
        Object.keys(this.playerShip).forEach(playerShipSocketId => {
            if (Object.keys(this.io.connected).indexOf(playerShipSocketId) == -1) {
                console.log("removed orphan : ", this.playerShip[playerShipSocketId]);
                delete this.playerShip[playerShipSocketId];
            }
        });
        //clean up assets
        Object.keys(this.broadcastService.assets).forEach(id => {
            //remove orphan ship
            let identified = this.broadcastService.assets[id];
            if (identified.id.startsWith("player/")) {
                let shipPayload = identified as ShipPayload;
                let found = false;
                Object.keys(this.playerShip).forEach(playerShipSocketId => {
                    if (shipPayload.id == this.playerShip[playerShipSocketId].id) {
                        found = true;
                    }
                });
                if (!found) {
                    console.log("removed orphan : ", identified);
                    this.broadcastService.deleteAsset(identified, undefined);
                }
            }
            //remove orphan bullet
            if (identified.id.startsWith("bullet/")) {
                let bulletPayload = identified as BulletPayLoad;
                let playerId = bulletPayload.pid;
                let found = false;
                Object.keys(this.playerShip).forEach(playerShipSocketId => {
                    let netPlayerShip = this.playerShip[playerShipSocketId];
                    if (netPlayerShip.id === playerId) {
                        found = true;
                        return true;//break some
                    }
                    return false;
                });
                if (!found) {
                    console.log("removed orphan : ", identified);
                    this.broadcastService.deleteAsset(identified, undefined);
                }
            }
        });
    }

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
                let asteroid = new Asteroid(x, y, aSize);
                asteroid.velocityX = Math.random(), //velocity X;
                    asteroid.velocityY = Math.random(), //velocity X;
                    this.asteroids[asteroid.id] = asteroid;
                this.distributedAssetLocator.createAsset(this.asteroidPayloadConverter.createNetworkPayloadFromAsteroid(asteroid), undefined);
            }
        }
    }
}
