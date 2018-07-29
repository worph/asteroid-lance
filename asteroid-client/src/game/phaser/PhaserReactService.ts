import * as EventEmitter from "eventemitter3";

export class PhaserReactService {
    private _parameters:any;
    gameDestroyedCallback:(()=>void)[] = [];
    eventEmitter = new EventEmitter();

    get parameters(): any {
        return this._parameters;
    }

    set parameters(value: any) {
        this._parameters = value;
    }

    onDestroyEvent(callback:()=>void){
        this.gameDestroyedCallback.push(callback);
    }

    destroy(){
        this.gameDestroyedCallback.forEach(value => {
            value();
        });
        this.gameDestroyedCallback = [];
        this.parameters = {};
    }


}

export let phaserReactService = new PhaserReactService();