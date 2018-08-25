

import {ShipFactory} from "../object/ShipFactory";
import LanceGameModel from "../LanceGameModel";

export class PlayerConnexionRule{
    constructor(private gameModel:LanceGameModel,private shipFactory:ShipFactory){
        this.gameModel.on("playerJoined",()=>{
            console.log("player joined");
            shipFactory.create();
        });
        this.gameModel.on("playerDisconnected",()=>{
            console.log("player disconected");
            //TODO mange this case
        });
    }
}