import {Entity} from "./Entity";
import {EntityInterface} from "./EntityInterface";

export class ECS {

    private worldEntities:{[id:string]:EntityInterface}={}

    createNewEntity():EntityInterface{
        let entity = new Entity(this.makeid(64));
        this.worldEntities[entity.id] = entity;
        return entity;
    }

    getEntity(id:string){
        return this.worldEntities[id];
    }

    entityPresent(entityId:string){
        return this.worldEntities[entityId]!=undefined;
    }

    removeEntity(entityId:string){
        if(this.worldEntities[entityId] == undefined) {
            throw new Error("removeEntity failed");
        }
        delete this.worldEntities[entityId];
    }

    addEntity(entity:EntityInterface):void{
        console.log("add entity : "+entity.getEntityId());
        if(this.worldEntities[entity.getEntityId()] == undefined) {
            this.worldEntities[entity.getEntityId()] = entity;
        }else{
            throw new Error("addEntity failed");
        }
    }

    makeid(length:number):string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}