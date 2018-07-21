"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bullet extends Phaser.GameObjects.Graphics {
    constructor(scene, params, id, parentShipId) {
        super(scene, params);
        this.id = id;
        this.parentShipId = parentShipId;
        // variables
        this.colors = [];
        this.colors.push(0x3ae0c4);
        this.colors.push(0x39e066);
        this.colors.push(0xe08639);
        let rndColor = Phaser.Math.RND.between(0, 2);
        this.selectedColor = this.colors[rndColor];
        this.currentScene = scene;
        this.lifeSpan = 100;
        this.isOffScreen = false;
        // init bullet
        this.x = params.x;
        this.y = params.y;
        this.velocity = new Phaser.Math.Vector2(15 * Math.cos(params.rotation - Math.PI / 2), 15 * Math.sin(params.rotation - Math.PI / 2));
        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);
        // physics
        this.currentScene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setCircle(3);
        this.body.setOffset(-3, -3);
        this.currentScene.add.existing(this);
    }
    getBody() {
        return this.body;
    }
    update() {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.lifeSpan < 0) {
            this.setActive(false);
        }
        else {
            this.lifeSpan--;
        }
    }
}
exports.Bullet = Bullet;
