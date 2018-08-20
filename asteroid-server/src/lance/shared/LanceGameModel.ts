

import SimplePhysicsEngine from 'lance-gg/es5/physics/SimplePhysicsEngine';
import GameEngine from 'lance-gg/es5/GameEngine';
import Ship from "./Ship";
import TwoVector from 'lance-gg/es5/serialize/TwoVector';

export default class LanceGameModel extends GameEngine{
    private physicsEngine: any;

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                type: 'brute'
            }
        });
    }

    registerClasses(serializer){
        serializer.registerClass(Ship);
    }

    initWorld(){
        super.initWorld({
            worldWrap: true,
            width: 3000,
            height: 3000
        });
    }

    start() {
        super.start();
    };

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId);
    };

    initGame() {
        this.addObjectToWorld(new Ship(this, null, { position: new TwoVector(10, 10) }));
    }

    private addObjectToWorld(item: any) {
        super.addObjectToWorld(item);
    }
}
