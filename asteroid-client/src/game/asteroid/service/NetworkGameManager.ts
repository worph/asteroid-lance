import * as SocketIO from "socket.io-client";
import axios from 'axios'

export default class NetworkGameManager {
    private socket: any;

    start(url:string,currentPlayerId:string){
        const httpClient = axios.create();
        httpClient.get('http://127.0.0.1:8085/asteroid-game').then(response => {
            let data = response.data;
            console.log(data);
        });
        this.socket = SocketIO(url, { forceNew: true });
        this.socket.emit("playership",currentPlayerId);
    }
}