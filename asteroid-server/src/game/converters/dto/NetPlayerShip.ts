
export class NetPlayerShip {
    id:string;
    name:string;
    currentScore:number

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.currentScore = 0;
    }
}
