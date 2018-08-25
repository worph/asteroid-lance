
import {Component} from "asteroid-common/dist/miniECS/Component";
import {KeyMapper} from "./KeyMapper";

export class InputComponent implements Component{
    getComponentType(): string {
        return "InputComponent";
    }

    constructor(public keymapper:KeyMapper){}
}