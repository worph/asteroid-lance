import {Entity} from "./Entity";
import {EntityInterface} from "./EntityInterface";

export class MiniECS {

    worldEntities:{[id:string]:EntityInterface}={}

    createNewEntity():EntityInterface{
        let entity = new Entity(this.makeid(64));
        this.worldEntities[entity.id] = entity;
        return entity;
    }

    getEntity(id:string){
        return this.worldEntities[id];
    }

    addEntity(entity:EntityInterface):void{
        this.worldEntities[entity.getEntityId()] = entity;
    }

    makeid(length:number):string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}