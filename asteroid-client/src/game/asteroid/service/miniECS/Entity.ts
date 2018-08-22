import {Identified} from "../Identified";
import {Component} from "./Component";

export class Entity implements Identified{
    constructor(public id: string) {
    }

    component:Component[] = []
}