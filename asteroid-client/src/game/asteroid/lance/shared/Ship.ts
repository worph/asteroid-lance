import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';
import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import TwoVector from 'lance-gg/es5/serialize/TwoVector';
interface DynamicObjectInterface{

}
export default class Ship extends DynamicObject {
    private id: number;
    private position: TwoVector;

    constructor(gameEngine, options, props){
        super(gameEngine, options, props);
    }

    /**
     * The maximum velocity allowed.  If returns null then ignored.
     * @memberof DynamicObject
     * @member {Number} maxSpeed
     */
    get maxSpeed() { return 3.0; }

    static get netScheme() {
        return super.netScheme;
    }

    toString() {
        return `Ship::${super.toString()}`;
    }

    syncTo(other) {
        super.syncTo(other);
    }

    destroy() {
    }
}
