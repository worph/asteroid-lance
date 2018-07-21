import {Bullet} from "./Bullet";
import {CONST} from "../const/const";
import {Identified} from "../service/Asset";

export class Ship extends Phaser.GameObjects.Graphics {
    private currentScene: Phaser.Scene;
    private velocity: Phaser.Math.Vector2;
    private cursors: any;
    private bullets: { [id: string]: Bullet; };
    private shootKey: Phaser.Input.Keyboard.Key;
    private isShooting: boolean;
    private nextBulletNumber: number = 0;

    public getBullets(): { [id: string]: Bullet; } {
        return this.bullets;
    }

    public getBody(): any {
        return this.body;
    }

    constructor(params, public id: string, public keyboardControlled: boolean) {
        super(params.scene, params.opt);

        // variables
        this.currentScene = params.scene;
        this.bullets = {};
        this.isShooting = false;

        // init ship
        this.initShip();

        if (keyboardControlled) {
            // input
            this.cursors = this.currentScene.input.keyboard.createCursorKeys();
            this.shootKey = this.currentScene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            );
        }

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.body.allowGravity = false;
        this.body.setSize(CONST.SHIP_SIZE * 2, CONST.SHIP_SIZE * 2);
        this.body.setOffset(-CONST.SHIP_SIZE, -CONST.SHIP_SIZE);

        this.currentScene.add.existing(this);
    }

    private initShip(): void {
        // define ship properties
        this.x = this.currentScene.sys.canvas.width / 2;
        this.y = this.currentScene.sys.canvas.height / 2;
        this.velocity = new Phaser.Math.Vector2(0, 0);

        // define ship graphics and draw it
        this.lineStyle(1, 0xff0000);

        this.strokeTriangle(
            -CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            CONST.SHIP_SIZE,
            0,
            -CONST.SHIP_SIZE
        );
    }

    update(): void {
        if (this.active) {
            if (this.keyboardControlled) {
                this.handleInput();
            }
        } else {
        }
        if (this.keyboardControlled) {
            this.applyForces();
            this.updateBullets();
        }
    }

    private handleInput(): void {
        if (this.cursors.up.isDown) {
            this.boost();
        }

        if (this.cursors.right.isDown) {
            this.rotation += 0.05;
        } else if (this.cursors.left.isDown) {
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

    private boost(): void {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(
            Math.cos(this.rotation - Math.PI / 2),
            Math.sin(this.rotation - Math.PI / 2)
        );

        // reduce the force and apply it to the velocity
        force.scale(0.12);
        this.velocity.add(force);
    }

    private applyForces(): void {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // reduce the velocity
        this.velocity.scale(0.98);
    }

    private shoot(): void {
        this.createBullet("bullet/" + this.nextBulletNumber + "-" + this.id,this.x, this.y, this.rotation);
    }

    deleteBullet(bulletid:string){
        this.bullets[bulletid].destroy();
        delete this.bullets[bulletid];
    }

    createBullet(bulletid:string, x: number, y: number, rotation: number) {
        this.nextBulletNumber++;
        this.bullets[bulletid] =
            new Bullet(this.currentScene, {
                x: x,
                y: y,
                rotation: rotation
            },bulletid,this.id);
    }

    private recoil(): void {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(
            -Math.cos(this.rotation - Math.PI / 2),
            -Math.sin(this.rotation - Math.PI / 2)
        );

        // reduce the force and apply it to the velocity
        force.scale(0.2);
        this.velocity.add(force);
    }

    private updateBullets(): void {
        Object.keys(this.bullets).forEach(key => {
            let bullet = this.bullets[key];
            if (bullet.active) {
                bullet.update();
            } else {
                this.deleteBullet(key);
            }
        });
    }
}
