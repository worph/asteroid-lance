import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {EntityInterface} from "../../miniECS/EntityInterface";
import {LanceNetworkEntity} from "../ecs/LanceNetworkEntity";
import {AssetIDGenerator} from "../const/AssetIDGenerator";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import {idService} from "../../service/IDService";
import LanceGameModel from "../LanceGameModel";

export class ShipFactory {
    static readonly CONST:{
        SIZE_RADIUS:number
    } = {
        SIZE_RADIUS: 20,
    };

    constructor(private gameModel:LanceGameModel) {
    }


    create():EntityInterface {
        //create player ship
        let eid = AssetIDGenerator.SHIP_PREFIX+idService.makeid(32);
        let ship = new LanceNetworkEntity(this.gameModel,null,{
            entityId : eid
        });
        let lancePhysicNetComponent = new LancePhysic2DObject(this.gameModel,null,{
            parentEntityID:eid,
            position: new TwoVector((Math.random()*100)+20, (Math.random()*100)+20),
            velocity: new TwoVector(0, 0),
            angle:0,//rad
            angleVelocity:0,
            physic:{
                body:{
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape:{
                    type:"circle",
                    radius: ShipFactory.CONST.SIZE_RADIUS,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        });
        ship.component.push(lancePhysicNetComponent);
        //order matter
        this.gameModel.addObjectToWorld(ship);//TODO improve this mech
        this.gameModel.addObjectToWorld(lancePhysicNetComponent);//TODO improve this mech
        return ship;
    }
}
