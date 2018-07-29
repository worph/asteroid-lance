import {Bullet} from "./Bullet";
import {Identified} from "../service/network/Asset";

let CONST = {
    SHIP_SIZE: 20,
    LIVES: 3,
};

export class Ship extends Phaser.GameObjects.Graphics implements Identified{
    private currentScene: Phaser.Scene;
    private cursors: any;
    private bullets: { [id: string]: Bullet; };
    private shootKey: Phaser.Input.Keyboard.Key;
    private isShooting: boolean;
    private nextBulletNumber: number = 0;
    private callBack:(string:string) => void = string => {};
    private boostMode: boolean = false;
    static readonly ID_PREFIX: string = "ship/";

    public getBullets(): { [id: string]: Bullet; } {
        return this.bullets;
    }

    public getBody():  Phaser.Physics.Matter.Image {
        let ret : any = this;
        return ret;
    }

    constructor(params:GraphicsParam, public id: string, public keyboardControlled: boolean) {
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
        let body = this.currentScene.matter.add.gameObject(this,{ shape: { type: 'circle', radius: CONST.SHIP_SIZE*1.5 } });
        /*this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.body.allowGravity = false;
        this.body.setSize(CONST.SHIP_SIZE * 2, CONST.SHIP_SIZE * 2);
        this.body.setOffset(-CONST.SHIP_SIZE, -CONST.SHIP_SIZE);*/

        this.getBody().setFriction(0,0,0);
        this.getBody().setIgnoreGravity(true);
        this.getBody().setBounce(1);

        this.currentScene.add.existing(this);
    }

    onBulletCreated(callBack:(string:string) => void):void{
        this.callBack = callBack;
    }

    private initShip(): void {
        // define ship properties
        this.x = this.currentScene.sys.canvas.width / 2;
        this.y = this.currentScene.sys.canvas.height / 2;

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
        if(this.boostMode){
            this.boost();
        }
        if (this.active) {
            if (this.keyboardControlled) {
                this.handleInput();
            }
        } else {
        }
        if (this.keyboardControlled) {
            this.updateBullets();
        }
    }

    private handleInput(): void {
        this.getBody().setAngularVelocity(0);//enable dampeners
        if (this.cursors.up.isDown) {
            this.boost();
        }
        //TODO https://labs.phaser.io/edit.html?src=src\physics\matterjs\rotate%20body%20with%20cursors.js
        if (this.cursors.right.isDown) {
            this.rotation += 0.05;
        } else if (this.cursors.left.isDown) {
            this.rotation -= 0.05;
        }

        if (this.shootKey.isDown && !this.isShooting) {
            this.shoot();
            //this.recoil();
            this.isShooting = true;
        }

        if (this.shootKey.isUp) {
            this.isShooting = false;
        }
    }

    public boost(): void {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(
            Math.cos(this.rotation - Math.PI / 2),
            Math.sin(this.rotation - Math.PI / 2)
        );

        // reduce the force and apply it to the velocity
        force.scale(0.01);
        //this.getBody().setVelocity(force.x,force.y);
        this.getBody().applyForce(force);
    }

    public shoot(): void {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(
            Math.cos(this.rotation - Math.PI / 2),
            Math.sin(this.rotation - Math.PI / 2)
        );
        force.scale(CONST.SHIP_SIZE);//just ahead of the ship
        this.createBullet("bullet/" + this.nextBulletNumber + "-" + this.id,this.x+force.x, this.y+force.y, this.rotation);
    }

    deleteBullet(bulletid:string){
        this.bullets[bulletid].destroy();
        delete this.bullets[bulletid];
    }

    createBullet(bulletid:string, x: number, y: number, rotation: number) {
        this.nextBulletNumber++;
        this.bullets[bulletid] =
            new Bullet({scene:this.currentScene,opt:{}},x,y,rotation,bulletid,this.id);
        this.callBack(bulletid);
    }

    private recoil(): void {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(
            -Math.cos(this.rotation - Math.PI / 2),
            -Math.sin(this.rotation - Math.PI / 2)
        );

        // reduce the force and apply it to the velocity
        force.scale(0.2);
        this.getBody().applyForce(force);
    }

    public updateBullets(): void {
        Object.keys(this.bullets).forEach(key => {
            let bullet = this.bullets[key];
            if (bullet.active) {
                bullet.update();
            } else {
                this.deleteBullet(key);
            }
        });
    }

    setBoost(b: boolean) {
        this.boostMode = b;
    }
}
