import {Component} from "./Component";
import {Identified} from "../service/Identified";
import {EntityInterface} from "./EntityInterface";

export class Entity implements Identified, EntityInterface {

    component: Component[] = [];

    constructor(public id: string) {
    }

    addComponent(componet: Component): void {
        this.component.push(componet);
    }

    getEntityId(): string {
        throw this.id;
    }

    getComponentByType(type: any): Component {
        let ret = null;
        this.component.forEach((data) => {
            if (data instanceof type) {
                ret = data;
            }
        });
        return ret;
    }
}