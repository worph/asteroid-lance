import * as RandomJS from "random-js";

export class SyncRandomNumberGenerator{
    private random:any = new RandomJS(RandomJS.engines.mt19937().seed(42));

    update(stepSeed:number):void{
        this.random = new RandomJS(RandomJS.engines.mt19937().seed(stepSeed));
    }

    getRandomAPI():any{
        return this.random;
    }

}