import {Entity} from "./Entity";

export class MiniECS {

    worldEntities:{[id:string]:Entity}={}

    createNewEntity():Entity{
        return new Entity(this.makeid(64));
    }

    makeid(length:number):string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}