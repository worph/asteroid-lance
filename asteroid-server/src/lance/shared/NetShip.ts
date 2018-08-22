import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';

export default class NetShip extends DynamicObject{

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
