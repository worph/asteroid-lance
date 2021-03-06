import GameObject from 'lance-gg/es5/serialize/GameObject';
import {EntityInterface} from "../../miniECS/EntityInterface";
import {Component} from "../../miniECS/Component";
import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';



export class LanceNetworkEntity extends GameObject implements EntityInterface {

    entityId:string="";
    component:Component[] = [];//not network
    componentWaitting : {[id:string] : ((data:Component)=>void)[] } = {};// id = componetType / callback

    constructor(private gameEngine,private option, public props){
        //do not touch this constructor it is needed for serialisation
        super(gameEngine, option, props);
        if(props!=null){
            this.entityId = props.entityId;
        }
    }

    static get netScheme() {
        return Object.assign({
            entityId: { type: BaseTypes.TYPES.STRING},
            //component: { type: BaseTypes.TYPES.LIST}
        }, super.netScheme);
    }

    addComponent(component: Component): void {
        this.component.push(component);
        this.triggerCallback(component);
    }

    triggerCallback(component:Component):void{
        let type = component.getComponentType();
        let callbackList = this.componentWaitting[type];
        if(callbackList != undefined){
            callbackList.forEach(value => {
                value(component);
            })
        }
        delete this.componentWaitting[type];
    }

    onceComponentType(type:any,callback:(data:Component)=>void):void{
        let componentByType = this.getComponentByType(type);
        if(componentByType){
            callback(componentByType);
            return;
        }
        //setup listener
        let callbackList = this.componentWaitting[type];
        if(callbackList == undefined){
            callbackList = [];
            this.componentWaitting[type] = callbackList;
        }
        callbackList.push(callback);
    }

    getComponentByType(type:any):Component{
        let ret = null;
        this.component.forEach((data)=>{
            let typeOfData = data.getComponentType();
            if(typeOfData===type){
                ret = data;
            }
        });
        return ret;
    }

    getEntityId(): string {
        return this.entityId;
    }

}