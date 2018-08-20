
import ServerEngine from 'lance-gg/es5/ServerEngine';
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import Ship from "./shared/Ship";

export default class LanceServerEngine extends ServerEngine {
    constructor(io,public gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        console.log("player constructor");
        console.log(this);
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
        setTimeout(makePlayerShip,3000);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
    }

    private makeShip(playerId) {
        console.log("makeship");
        let ship = new Ship(this, null, {
            position: new TwoVector(10, 10)
        });
        this.gameEngine.addObjectToWorld(ship);
    }
}
