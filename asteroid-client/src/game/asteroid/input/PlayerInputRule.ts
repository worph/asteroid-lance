import {KeyMapper} from "./KeyMapper";
import {LancePhysicNetComponent} from "../lance/LancePhysicNetComponent";
import {InputComponent} from "./InputComponent";

export class PlayerInputRule extends InputComponent{
    constructor(keymapper:KeyMapper,physic: LancePhysicNetComponent){
        super(keymapper);
        //find lance physic object associated to player and aplie action
        keymapper.action.on(KeyMapper.LEFT,(data)=>{
            physic.rotateLeft(0.05);
        });
        keymapper.action.on(KeyMapper.RIGHT,(data)=>{
            physic.rotateRight(0.05);
        });
        keymapper.action.on(KeyMapper.BOOST,(data)=>{
            physic.accelerate({x:100,y:0});
        });
    }
}