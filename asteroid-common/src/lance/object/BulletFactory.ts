import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {EntityInterface} from "../../miniECS/EntityInterface";
import {LanceNetworkEntity} from "../ecs/LanceNetworkEntity";
import {AssetIDGenerator} from "../const/AssetIDGenerator";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import LanceGameModel from "../LanceGameModel";
import {ShipFactory} from "./ShipFactory";

export class BulletFactory {
    static readonly CONST:{
        SIZE_RADIUS:number
    } = {
        SIZE_RADIUS: 3,
    };

    constructor(private gameModel:LanceGameModel) {
    }


    create(position:{x:number,y:number},rotationRad:number,parentVelocity:{x:number,y:number}):EntityInterface {
        //create player asteroid
        let eid = AssetIDGenerator.generateAssetID(AssetIDGenerator.BULLET_PREFIX);
        let asteroid = new LanceNetworkEntity(this.gameModel,null,{
            entityId : eid
        });
        this.gameModel.addObjectToWorld(asteroid);//TODO improve this mech
        //rotation is in degree
        // create the direction in the correct direction
        let direction = {
            x:Math.cos(rotationRad),
            y:Math.sin(rotationRad)};
        let positionUpdate = {x:direction.x*ShipFactory.CONST.SIZE_RADIUS,y:direction.y*ShipFactory.CONST.SIZE_RADIUS};//just ahead of the ship
        let velocity = {x:direction.x*500,y:direction.y*500};
        let props = {
            parentEntityID:eid,
            position: new TwoVector(position.x + positionUpdate.x, position.y + positionUpdate.y),
            velocity: new TwoVector(parentVelocity.x + velocity.x, parentVelocity.y + velocity.y),
            angle: rotationRad,//radian
            angleVelocity: 0,
            physic: {
                body: {
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape: {
                    type: "circle",
                    radius: BulletFactory.CONST.SIZE_RADIUS,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        };
        let lancePhysicNetComponent = new LancePhysic2DObject(this.gameModel, null,props);
        asteroid.component.push(lancePhysicNetComponent);
        this.gameModel.addObjectToWorld(lancePhysicNetComponent);//TODO improve this mech
        return asteroid;
    }
}
