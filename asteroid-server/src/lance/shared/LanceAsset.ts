import DynamicObject from 'lance-gg/es5/serialize/DynamicObject';
import BaseTypes from 'lance-gg/es5/serialize/BaseTypes';

export default class LanceAsset extends DynamicObject{
    assetId:string;
    constructor(gameEngine,option, props){
        //do not toutch this constructor it is needed for serialisation
        super(gameEngine, option, props);
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