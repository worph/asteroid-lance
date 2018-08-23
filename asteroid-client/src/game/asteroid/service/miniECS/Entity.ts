import {Component} from "./Component";
import {Identified} from "./Identified";

export class Entity implements Identified{
    constructor(public id: string) {
    }

    component:Component[] = []
}