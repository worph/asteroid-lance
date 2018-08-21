
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

        // handle gui for game condition
        this.gameEngine.on('objectDestroyed', (obj) => {
            console.log('objectDestroyed');
        });

        this.gameEngine.once('renderer.ready', () => {
            console.log('renderer.ready');
            this.socket.emit('requestRestart');
        });
    }

    // extend ClientEngine connect to add own events
    connect() {
        return super.connect();
    }


}
