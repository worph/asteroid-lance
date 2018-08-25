import PhysicalObject2D from 'lance-gg/es5/serialize/PhysicalObject2D';
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';

interface DynamicObjectInterface {
    id:number,
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass:number,
    angle: number,
    physicsObj:any
}

export default class LancePhysic2DObject extends PhysicalObject2D implements DynamicObjectInterface{
    //DynamicObjectInterface
    id: number;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    mass: number;
    angle: number;
    physicsObj: any;
    //

    assetId:string;
    private customDataString:string="{}";

    constructor(private gameEngine,private option, public props){
        //do not touch this constructor it is needed for serialisation
        super(gameEngine, option, props);
    }

    setCustomData(object:any):void{
        this.customDataString = JSON.stringify(object);
    }

    getCustomData():any{
        return JSON.parse(this.customDataString);
    }

    // on add-to-world, create a physics body
    onAddToWorld() {
        if(this.props==undefined){
            //default props
            this.props = {
                position: new TwoVector(10, 10),
                velocity: new TwoVector(0, 0),
                angle:0,//rad
                angleVelocity:0,
                    physic:{
                    body:{
                        mass: 1, damping: 0, angularDamping: 0
                    },
                    shape:{
                        type:"circle",
                            radius: 0.3,
                            collisionGroup: 1,
                            collisionMask: 1
                    }
                }
            }
        }
        let game = this.gameEngine;
        let p2 = game.physicsEngine.p2;
        let body = this.props.physic.body;
        let shape = this.props.physic.shape;
        this.physicsObj = new p2.Body({
            mass: body.mass, damping: body.damping, angularDamping: body.angularDamping,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        this.physicsObj.addShape(new p2.Circle({
            radius: shape.radius,
            collisionGroup: shape.collisionGroup,
            collisionMask: shape.collisionMask
        }));
        /*this.physicsObj = new p2.Body({
            mass: 1, damping: 0, angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        this.physicsObj.addShape(new p2.Circle({
            radius: 0.3,
            collisionGroup: 1,
            collisionMask: 1
        }));*/
        game.physicsEngine.world.addBody(this.physicsObj);
    }

    static get netScheme() {
        return Object.assign({
            assetId: { type: BaseTypes.TYPES.STRING},
            customDataString: { type: BaseTypes.TYPES.STRING}
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
