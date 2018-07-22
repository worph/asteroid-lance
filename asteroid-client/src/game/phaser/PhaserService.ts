
export class PhaserService {
    private _parameters:any;
    gameDestroyedCallback:(()=>void)[] = [];

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

export let phaserService = new PhaserService();