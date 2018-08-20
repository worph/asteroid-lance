
import ClientEngine from 'lance-gg/es5/ClientEngine';
import LanceModelRenderer from "./LanceModelRenderer";

export default class LanceClientEngine extends ClientEngine {
    private socket: any;
    private gameEngine: any;
    private messageIndex: number;

    constructor(gameEngine, options) {
        super(gameEngine, options, LanceModelRenderer);
    }

    start() {
        super.start();
    }

}
