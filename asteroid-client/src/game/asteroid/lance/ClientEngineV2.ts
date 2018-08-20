
import ClientEngine from 'lance-gg/es5/ClientEngine';

export default class ClientEngineV2 extends ClientEngine {
    private socket: any;
    private gameEngine: any;
    private messageIndex: number;
    private networkMonitor: any;
    private inboundMessages: any;

    connect(options = {}) {

        let connectSocket = matchMakerAnswer => {
            return new Promise((resolve, reject) => {

                if (matchMakerAnswer.status !== 'ok')
                    reject();

                console.log(`connecting to game server ${matchMakerAnswer.serverURL}`);
                //this.socket = io(matchMakerAnswer.serverURL, options);

                this.networkMonitor.registerClient(this);

                this.socket.once('connect', () => {
                    console.log('connection made');
                    resolve();
                });

                this.socket.on('playerJoined', (playerData) => {
                    this.gameEngine.playerId = playerData.playerId;
                    this.messageIndex = Number(this.gameEngine.playerId) * 10000;
                });

                this.socket.on('worldUpdate', (worldData) => {
                    this.inboundMessages.push(worldData);
                });
            });
        };

        let matchmaker = Promise.resolve({ serverURL: null, status: 'ok' });

        return matchmaker.then(connectSocket);
    }

}
