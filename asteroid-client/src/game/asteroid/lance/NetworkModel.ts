
import Renderer from 'lance-gg/es5/render/Renderer';

export default class NetworkModel extends Renderer {
    private gameEngine: any;

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
    }

    draw(t, dt) {
        super.draw(t, dt);
    }

    addObject(obj){
        super.addObject(obj);
        console.log('objectAdded',obj);
        //TODO
    }

    removeObject(obj){
        super.removeObject(obj);
        console.log('objectDestroyed',obj);
        //TODO
    }

    runClientStep(t, dt){
        //TODO
        super.runClientStep(t, dt);
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let objData = this.gameEngine.world.objects[objId];
            //TODO Update graphic model
        }
    }
}