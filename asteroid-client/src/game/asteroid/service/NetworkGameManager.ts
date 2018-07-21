import * as SocketIO from "socket.io-client";
import axios, {AxiosInstance} from 'axios'
import {CONST} from "../const/const";
import {NetPlayerShip} from "./NetPlayerShip";

export default class NetworkGameManager {
    private socket: any;
    private httpClient: AxiosInstance;
    netPlayers: { [id: string]: NetPlayerShip; } = {};

    start(url: string, currentPlayerId: string) {
        this.httpClient = axios.create();
        this.httpClient.get('http://127.0.0.1:8085/asteroid-game/info').then(response => {
            let data = response.data;
            console.log(data);
        });
        this.httpClient.get('http://127.0.0.1:8085/asteroid-game/players').then(response => {
            let data = response.data;
            this.netPlayers = data;
        });
        this.socket = SocketIO(url, {forceNew: false});
        this.socket.on('score',payload => {
            this.netPlayers[payload.id] = payload.data;
            console.log(this.netPlayers);
        });
        this.socket.emit("playership", currentPlayerId);
    }

    public updateScore(asteroidId: string, playerId: string, aSizeOfAsteroid: number) {
        this.httpClient.get(
            'http://127.0.0.1:8085/asteroid-game/notify_score' + '?' + 'asteroid=' + asteroidId + '&' + "asteroidsize=" + aSizeOfAsteroid + '&' + "player=" + playerId)
            .then(response => {
                let data = response.data;
                console.log(data);
            });
    }
}