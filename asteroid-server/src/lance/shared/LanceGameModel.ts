import SimplePhysicsEngine from 'lance-gg/es5/physics/SimplePhysicsEngine';
import GameEngine from 'lance-gg/es5/GameEngine';
import Ship from "./Ship";
import Asteroid from "./Asteroid";
import Bullet from "./Bullet";

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
        serializer.registerClass(Asteroid);
        serializer.registerClass(Bullet);
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

    addObjectToWorld(item: any) {
        super.addObjectToWorld(item);
    }
}
