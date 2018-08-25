
import {Component} from "asteroid-common/dist/miniECS/Component";
import {KeyMapper} from "./KeyMapper";

export class InputComponent implements Component{
    constructor(public keymapper:KeyMapper){}
}