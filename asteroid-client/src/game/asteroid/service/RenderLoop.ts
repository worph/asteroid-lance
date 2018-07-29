export class RenderLoop {

    events: { [id: string]: any; } = {};
    eventNextId = 0;
    callback : (event:any) => void;

    constructor(callback: (event: any) => void) {
        this.callback = callback;
    }

    notifyEvent(eventData: any) {
        this.eventNextId++;
        this.events["" + this.eventNextId] = eventData;
    }

    update() {
        Object.keys(this.events).sort((a: string, b: string) => {
            return +a - +b;
        }).forEach(key => {
            this.callback(this.events[key]);
            delete this.events[key];
        })
    }
}