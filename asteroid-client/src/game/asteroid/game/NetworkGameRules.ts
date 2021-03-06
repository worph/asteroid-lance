import * as SocketIO from "socket.io-client";
import axios, {AxiosInstance} from 'axios'
import {NetPlayerShip} from "./NetPlayerShip";
import {phaserReactService} from "../../phaser/PhaserReactService";

export default class NetworkGameRules {
    private socket: any;
    private httpClient: AxiosInstance;
    netPlayers: { [id: string]: NetPlayerShip; } = {};
    private apiUrl: string;

    start(url: string,apiUrl:string, currentPlayerId: string, currentPlayerName: string) {
        this.apiUrl = apiUrl+"/asteroid-game";
        this.httpClient = axios.create();
        this.httpClient.get(this.apiUrl+'/info').then(response => {
            let data = response.data;
            console.log(data);
        });
        this.httpClient.get(this.apiUrl+'/players').then(response => {
            let data = response.data;
            this.netPlayers = data;
        });
        this.socket = SocketIO(url, {forceNew: false});
        this.socket.on('score', payload => {
            this.netPlayers[payload.id] = payload.data;
            console.log(this.netPlayers);
        });
        this.socket.emit("playership", {
            id: currentPlayerId,
            name: currentPlayerName
        });
    }

    /**
     *
     * @param {string} playerId asset id
     */
    public notifyEndGame(playerId:string){
        this.httpClient.get(this.apiUrl+'/notify_end_game', {
            params: {
                player: playerId
            }
        }).then(response => {
            let data = response.data;
            phaserReactService.parameters.end = data;
            phaserReactService.eventEmitter.emit("redirect","/loser")
        });
    }

    public updateScore(asteroidId: string, playerId: string, aSizeOfAsteroid: number) {
        this.httpClient.get(this.apiUrl+'/notify_score', {
            params: {
                asteroid: asteroidId,
                asteroidsize: aSizeOfAsteroid,
                player: playerId
            }
        }).then(response => {
            let data = response.data;
        });
    }
}