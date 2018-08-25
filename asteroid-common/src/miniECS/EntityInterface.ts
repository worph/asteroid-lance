import {Component} from "./Component";

export interface EntityInterface {
    getEntityId():string;
    getComponentByType(type:any):Component;
    addComponent(componet:Component):void;
}