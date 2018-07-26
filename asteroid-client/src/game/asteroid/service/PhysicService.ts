
export class PhysicService {

    constructor(public matter:any) {
        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {

            bodyA.gameObject.setTint(0xff0000);
            bodyB.gameObject.setTint(0x00ff00);

        });
    }

}