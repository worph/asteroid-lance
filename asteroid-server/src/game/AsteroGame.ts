import {NetPlayerShip} from "./NetPlayerShip";

import * as SocketIO from "socket.io";
import * as express from 'express';

interface NVMFormat {
    scores: { [id: string]: number; }
}

export default class AsteroGame {
    nvm: NVMFormat = {
        scores: {}
    };
    playerShip: { [id: string]: NetPlayerShip; } = {}; // id => socket.id

    private numberOfAsteroids: number = 3;
    private worldSizeX: number = 1920;
    private worldSizeY: number = 1920;
    stepTimeMs: number = 1000;//millisecond
    io: SocketIO.Server;
    private expressApp: any;
    static readonly PLAYERSHIP_NOTIFY: string = "playership";

    start(io: SocketIO.Server, expressApp: any) {
        this.io = io.of('/asteroid');
        this.expressApp = expressApp;

        /////////////////////////////////////////////
        //Set up socket listener
        /////////////////////////////////////////////
        this.io.on('connection', (socket) => {
            console.log('a user connected: ', socket.id);

            socket.on(AsteroGame.PLAYERSHIP_NOTIFY, (data: { id: string, name: string }) => {
                this.playerShip[socket.id] = new NetPlayerShip(data.id, data.name);
            });

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id);
                if (this.playerShip[socket.id] != undefined) {
                    delete this.playerShip[socket.id];
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

        this.expressApp.use('/asteroid-game', router);

        /////////////////////////////////////////////
        //set up main update
        /////////////////////////////////////////////
        setInterval(() => {
            this.update()
        }, this.stepTimeMs);
        this.update();
    }


    update(): void {
        //TODO call asteroid rule
    }
}
