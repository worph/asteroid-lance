import ServerEngine from 'lance-gg/es5/ServerEngine';
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import Ship from "./shared/Ship";

import * as express from 'express';
export default class LanceServerEngine extends ServerEngine {
    constructor(public expressApp,io,public gameEngine, inputOptions) {
        super(io.of('/lance'), gameEngine, inputOptions);
        console.log("player constructor");
        //console.log(this);
        const router = express.Router();
        router.get('/matchmaker', (req, res) => {
            //final url must not have the socket.io part
            let finalurl = req.protocol + '://' + req.get('host')+"/lance";
            //let finalurl = req.protocol + '://' + req.get('host')+"";
            //let finalurl = "http://127.0.0.1:3000";
            res.json({ serverURL: finalurl, status: 'ok' })
        });

        this.expressApp.use('/asteroid-lance', router);
    }

    start() {
        super.start();
        console.log("player start");
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        console.log("player connected");

        let makePlayerShip = () => {
            this.makeShip(socket);
        };

        // handle client restart requests
        setTimeout(makePlayerShip,0);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
    }

    private makeShip(playerId) {
        let ship = new Ship(this.gameEngine, null, {
            position: new TwoVector(10, 10)
        });
        this.gameEngine.addObjectToWorld(ship);
        console.log("makeship");
    }
}
