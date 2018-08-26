import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {EntityInterface} from "../../miniECS/EntityInterface";
import {LanceNetworkEntity} from "../ecs/LanceNetworkEntity";
import {AssetIDGenerator} from "../AssetIDGenerator";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import LanceGameModel from "../LanceGameModel";
import {AsteroidCreationData} from "../rule/AsteroidCreationRule";
import {GenericObjectContainer} from "../component/GenericObjectContainer";

export class AsteroidFactory {
    static readonly CONST: {
        SIZE_RADIUS: number
    } = {
        SIZE_RADIUS: 20,
    };

    constructor(private gameModel: LanceGameModel, private assetIDGenerator: AssetIDGenerator) {
    }


    create(data: AsteroidCreationData): EntityInterface {
        //create player asteroid
        let eid = this.assetIDGenerator.generateAssetID(AssetIDGenerator.ASTEROID_PREFIX);
        let asteroid = new LanceNetworkEntity(this.gameModel, null, {
            entityId: eid
        });
        this.gameModel.addObjectToWorld(asteroid);//TODO improve this mech
        let props = {
            parentEntityID: eid,
            position: new TwoVector(data.position.x, data.position.y),
            velocity: new TwoVector(data.velocity.x, data.velocity.y),
            angle: data.rotation,//radian
            angleVelocity: data.velocityAngular,
            physic: {
                body: {
                    mass: 0.1, damping: 0, angularDamping: 0
                },
                shape: {
                    type: "circle",
                    radius: data.radius,
                    collisionGroup: 1,
                    collisionMask: 1
                }
            }
        };
        let lancePhysicNetComponent = new LancePhysic2DObject(this.gameModel, null, props);
        let genericObjectContainer = new GenericObjectContainer(this.gameModel, null, {
            parentEntityID: eid,
            genericData: data
        });
        asteroid.component.push(genericObjectContainer)
        asteroid.component.push(lancePhysicNetComponent);
        this.gameModel.addObjectToWorld(lancePhysicNetComponent);//TODO improve this mech
        this.gameModel.addObjectToWorld(genericObjectContainer);//TODO improve this mech
        return asteroid;
    }
}
