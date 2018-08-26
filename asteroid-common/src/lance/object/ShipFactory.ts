import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import {EntityInterface} from "../../miniECS/EntityInterface";
import {LanceNetworkEntity} from "../ecs/LanceNetworkEntity";
import {AssetIDGenerator} from "../AssetIDGenerator";
import LancePhysic2DObject from "../component/LancePhysic2DObject";
import {idService} from "../../service/IDService";
import LanceGameModel from "../LanceGameModel";
import {ShipDataModel} from "../component/ShipDataModel";

export class ShipFactory {
    static readonly CONST: {
        SIZE_RADIUS: number
    } = {
        SIZE_RADIUS: 20,
    };

    constructor(private gameModel: LanceGameModel, private assetIDGenerator: AssetIDGenerator) {
    }


    create(playerId: number): EntityInterface {
        //create player ship
        let eid = this.assetIDGenerator.generateAssetID(AssetIDGenerator.SHIP_PREFIX);
        let ship = new LanceNetworkEntity(this.gameModel, null, {
            entityId: eid
        });
        this.gameModel.addObjectToWorld(ship);//TODO improve this mech
        {
            let lancePhysicNetComponent = new LancePhysic2DObject(this.gameModel, null, {
                parentEntityID: eid,
                position: new TwoVector((Math.random() * 100) + 20, (Math.random() * 100) + 20),
                velocity: new TwoVector(0, 0),
                angle: 0,//rad
                angleVelocity: 0,
                physic: {
                    body: {
                        mass: 0.1, damping: 0, angularDamping: 0
                    },
                    shape: {
                        type: "circle",
                        radius: ShipFactory.CONST.SIZE_RADIUS,
                        collisionGroup: 1,
                        collisionMask: 1
                    }
                }
            });
            ship.component.push(lancePhysicNetComponent);
            this.gameModel.addObjectToWorld(lancePhysicNetComponent);//TODO improve this mech
        }
        {
            let shipDataModel = new ShipDataModel(this.gameModel, null, {
                parentEntityID: eid,
            });
            ship.component.push(shipDataModel);
            this.gameModel.addObjectToWorld(shipDataModel);//TODO improve this mech
            shipDataModel.state.playerId = playerId;
            shipDataModel.state.score = 0;
            shipDataModel.update();
        }
        //order matter
        return ship;
    }
}
