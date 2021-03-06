import Renderer from 'lance-gg/es5/render/Renderer';
import LanceGameModel from "asteroid-common/dist/lance/LanceGameModel";
import LanceClientEngine from "./LanceGameModelControler";

export default class LanceRenderer extends Renderer {
    constructor(gameEngine:LanceGameModel, clientEngine:LanceClientEngine) {
        super(gameEngine, clientEngine);
    }

    draw(t, dt) {
        super.draw(t, dt);
    }

    addObject(obj){
        super.addObject(obj);
        //console.log('objectAdded',obj);
    }

    removeObject(obj){
        super.removeObject(obj);
        console.log('objectDestroyed',obj);
    }

    runClientStep(t, dt){
        super.runClientStep(t, dt);
    }
}