

import SimplePhysicsEngine from 'lance-gg/es5/physics/SimplePhysicsEngine';
import GameEngine from 'lance-gg/es5/GameEngine';

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
}
