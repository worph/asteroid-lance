
import {Component} from "../../miniECS/Component";

export interface LanceNetworkComponent extends Component{
    getParentEntityId():string;
}