
import Renderer from 'lance/render/Renderer';

export default class LanceModelRenderer extends Renderer {
    private gameEngine: any;

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
    }

    draw(t, dt) {
        super.draw(t, dt);
    }
}