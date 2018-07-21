"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io-client");
const axios_1 = require("axios");
class NetworkGameManager {
    start(url, currentPlayerId) {
        const httpClient = axios_1.default.create();
        httpClient.get('http://127.0.0.1:8085/asteroid-game').then(response => {
            let data = response.data;
            console.log(data);
        });
        this.socket = SocketIO(url, { forceNew: true });
        this.socket.emit("playership", currentPlayerId);
    }
}
exports.default = NetworkGameManager;
