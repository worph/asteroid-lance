import PhysicalObject2D from 'lance-gg/es5/serialize/PhysicalObject2D';
import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';

interface DynamicObjectInterface {
    id:number,
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass:number,
    physicsObj:any
}

export default class LancePhysic2DObject extends PhysicalObject2D implements DynamicObjectInterface{
    velocity: { x: number; y: number };
    mass: number;
    physicsObj: any;
    id: number;
    position: { x: number; y: number };
    angle: number;
    assetId:string;
    constructor(private gameEngine,option, props){
        //do not toutch this constructor it is needed for serialisation
        super(gameEngine, option, props);
    }

    // on add-to-world, create a physics body
    onAddToWorld() {
        let game = this.gameEngine;
        let p2 = game.physicsEngine.p2;
        this.physicsObj = new p2.Body({
            mass: 1, damping: 0, angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        this.physicsObj.addShape(new p2.Circle({
            radius: 0.3,
            collisionGroup: 1,
            collisionMask: 1
        }));
        game.physicsEngine.world.addBody(this.physicsObj);
    }

    static get netScheme() {
        return Object.assign({
            assetId: { type: BaseTypes.TYPES.STRING}
        }, super.netScheme);
    }

    toString() {
        return `LanceAsset::${super.toString()}`;
    }

    syncTo(other) {
        super.syncTo(other);
    }

    destroy() {
        super.destroy();
    }
}
