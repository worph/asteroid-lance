import GameObject from 'lance-gg/es5/serialize/GameObject';
import {Component} from "../../miniECS/Component";
import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';
import {LanceNetworkComponent} from "../ecs/LanceNetworkComponent";

export class GenericObjectContainer extends GameObject implements LanceNetworkComponent {
    parentEntityID: string = "";
    data: string = "{}";//json string

    constructor(private gameEngine, private option, public props) {
        //do not touch this constructor it is needed for serialisation
        super(gameEngine, option, props);
        if (props!=null) {
            this.parentEntityID = props.parentEntityID;
            this.data = JSON.stringify(props.genericData);
            if(!this.parentEntityID){
                throw new Error();
            }
        }
    }

    getData(){
        return JSON.parse(this.data);
    }

    setData(data:any){
        this.data = JSON.stringify(data);
    }

    static get netScheme() {
        return Object.assign({
            parentEntityID: {type: BaseTypes.TYPES.STRING},
            data: { type: BaseTypes.TYPES.STRING}
        }, super.netScheme);
    }

    getParentEntityId(): string {
        return this.parentEntityID;
    }

    getComponentType(): string {
        return "GenericObjectContainer";
    }

}