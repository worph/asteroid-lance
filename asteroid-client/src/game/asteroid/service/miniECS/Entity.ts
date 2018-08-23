import {Component} from "./Component";
import {Identified} from "./Identified";

export class Entity implements Identified{
    constructor(public id: string) {
    }

    component:Component[] = []

    getComponentByType(type:any):Component{
        let ret = null;
        this.component.forEach((data)=>{
            if(data instanceof type){
                ret = data;
            }
        })
        return ret;
    }
}