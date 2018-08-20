
import Renderer from 'lance-gg/es5/render/Renderer';

export default class LanceModelRenderer extends Renderer {
    private gameEngine: any;

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
    }

    draw(t, dt) {
        super.draw(t, dt);
        console.log(this.gameEngine.world.objects)
    }
}