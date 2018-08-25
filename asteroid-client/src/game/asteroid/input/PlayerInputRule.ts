import {KeyMapper} from "./KeyMapper";
import {InputComponent} from "./InputComponent";
import InputDefinition from "asteroid-common/dist/lance/const/InputDefinition";
import LanceGameModelControler from "../lance/LanceGameModelControler";

export class PlayerInputRule extends InputComponent{
    constructor(keymapper:KeyMapper, private physicBodyId:number,private client:LanceGameModelControler){
        super(keymapper);
        //find lance physic object associated to player and aplie action
        keymapper.action.on(KeyMapper.LEFT,(data)=>{
            this.rotateLeft(0.05);
        });
        keymapper.action.on(KeyMapper.RIGHT,(data)=>{
            this.rotateRight(0.05);
        });
        keymapper.action.on(KeyMapper.BOOST,(data)=>{
            this.accelerate({x:100,y:0});
        });
        keymapper.action.on(KeyMapper.SHOOT,(data)=>{
            //bulletFactory.create({x:physic.body.position.x,y:physic.body.position.y},physic.body.angle,{x:physic.body.velocity.x,y:physic.body.velocity.y});
            this.client.sendInput(InputDefinition.SHOOT, {
                id:this.physicBodyId
            });
        });
    }


    rotateRight(speed:number){
        this.client.sendInput(InputDefinition.ROTATE_RIGHT, {
            id:this.physicBodyId,
            speed:speed
        });
    }

    rotateLeft(speed:number){
        this.client.sendInput(InputDefinition.ROTATE_LEFT, {
            id:this.physicBodyId,
            speed:speed
        });
    }

    accelerate(vector:{x:number,y:number}){
        this.client.sendInput(InputDefinition.ACCELERATE, {
            id:this.physicBodyId,
            vector:vector
        });
    }

}