"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const const_1 = require("../const/const");
class Ship extends Phaser.GameObjects.Graphics {
    constructor(params, id, keyboardControlled) {
        super(params.scene, params.opt);
        this.id = id;
        this.keyboardControlled = keyboardControlled;
        this.nextBulletNumber = 0;
        // variables
        this.currentScene = params.scene;
        this.bullets = {};
        this.isShooting = false;
        // init ship
        this.initShip();
        if (keyboardControlled) {
            // input
            this.cursors = this.currentScene.input.keyboard.createCursorKeys();
            this.shootKey = this.currentScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }
        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.body.allowGravity = false;
        this.body.setSize(const_1.CONST.SHIP_SIZE * 2, const_1.CONST.SHIP_SIZE * 2);
        this.body.setOffset(-const_1.CONST.SHIP_SIZE, -const_1.CONST.SHIP_SIZE);
        this.currentScene.add.existing(this);
    }
    getBullets() {
        return this.bullets;
    }
    getBody() {
        return this.body;
    }
    initShip() {
        // define ship properties
        this.x = this.currentScene.sys.canvas.width / 2;
        this.y = this.currentScene.sys.canvas.height / 2;
        this.velocity = new Phaser.Math.Vector2(0, 0);
        // define ship graphics and draw it
        this.lineStyle(1, 0xff0000);
        this.strokeTriangle(-const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, 0, -const_1.CONST.SHIP_SIZE);
    }
    update() {
        if (this.active) {
            if (this.keyboardControlled) {
                this.handleInput();
            }
        }
        else {
        }
        if (this.keyboardControlled) {
            this.applyForces();
            this.updateBullets();
        }
    }
    handleInput() {
        if (this.cursors.up.isDown) {
            this.boost();
        }
        if (this.cursors.right.isDown) {
            this.rotation += 0.05;
        }
        else if (this.cursors.left.isDown) {
            this.rotation -= 0.05;
        }
        if (this.shootKey.isDown && !this.isShooting) {
            this.shoot();
            this.recoil();
            this.isShooting = true;
        }
        if (this.shootKey.isUp) {
            this.isShooting = false;
        }
    }
    boost() {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(Math.cos(this.rotation - Math.PI / 2), Math.sin(this.rotation - Math.PI / 2));
        // reduce the force and apply it to the velocity
        force.scale(0.12);
        this.velocity.add(force);
    }
    applyForces() {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // reduce the velocity
        this.velocity.scale(0.98);
    }
    shoot() {
        this.createBullet("bullet/" + this.nextBulletNumber + "-" + this.id, this.x, this.y, this.rotation);
    }
    deleteBullet(bulletid) {
        this.bullets[bulletid].destroy();
        delete this.bullets[bulletid];
    }
    createBullet(bulletid, x, y, rotation) {
        this.nextBulletNumber++;
        this.bullets[bulletid] =
            new Bullet_1.Bullet(this.currentScene, {
                x: x,
                y: y,
                rotation: rotation
            }, bulletid, this.id);
    }
    recoil() {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(-Math.cos(this.rotation - Math.PI / 2), -Math.sin(this.rotation - Math.PI / 2));
        // reduce the force and apply it to the velocity
        force.scale(0.2);
        this.velocity.add(force);
    }
    updateBullets() {
        Object.keys(this.bullets).forEach(key => {
            let bullet = this.bullets[key];
            if (bullet.active) {
                bullet.update();
            }
            else {
                this.deleteBullet(key);
            }
        });
    }
}
exports.Ship = Ship;
