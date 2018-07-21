"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io-client");
const axios_1 = require("axios");
class NetworkGameManager {
    constructor() {
        this.netPlayers = {};
    }
    start(url, currentPlayerId) {
        this.httpClient = axios_1.default.create();
        this.httpClient.get('http://127.0.0.1:8085/asteroid-game/info').then(response => {
            let data = response.data;
            console.log(data);
        });
        this.httpClient.get('http://127.0.0.1:8085/asteroid-game/players').then(response => {
            let data = response.data;
            this.netPlayers = data;
        });
        this.socket = SocketIO(url, { forceNew: false });
        this.socket.on('score', payload => {
            this.netPlayers[payload.id] = payload.data;
            console.log(this.netPlayers);
        });
        this.socket.emit("playership", currentPlayerId);
    }
    updateScore(asteroidId, playerId, aSizeOfAsteroid) {
        this.httpClient.get('http://127.0.0.1:8085/asteroid-game/notify_score' + '?' + 'asteroid=' + asteroidId + '&' + "asteroidsize=" + aSizeOfAsteroid + '&' + "player=" + playerId)
            .then(response => {
            let data = response.data;
            console.log(data);
        });
    }
}
exports.default = NetworkGameManager;
