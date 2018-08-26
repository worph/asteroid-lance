

import {ShipFactory} from "../object/ShipFactory";
import LanceGameModel from "../LanceGameModel";

export class PlayerConnexionRule{
    constructor(private gameModel:LanceGameModel,private shipFactory:ShipFactory){
        this.gameModel.on("playerJoined",(data:{
            "id": string,
            "playerId": number,
            "joinTime": number,
            "disconnectTime": number
        })=>{
            console.log("player joined");
            shipFactory.create(data.playerId);
        });
        this.gameModel.on("playerDisconnected",()=>{
            console.log("player disconected");
            //TODO mange this case
        });
    }
}