import {Bullet} from "../objects/Bullet";
import {Ship} from "../objects/Ship";
import {Asteroid} from "../objects/Asteroid";
import NetworkGameRules from "./NetworkGameRules";
import NetworkAssets from "../service/network/NetworkAssets";
import {AsteroidPayloadConverter} from "./converters/AsteroidPayloadConverter";
import {ShipPayloadConverter} from "./converters/ShipPayloadConverter";
import {BulletPayloadConverter} from "./converters/BulletPayloadConverter";
import {AssetConverter, IdentifiedConverter} from "../service/network/AssetConverter";
import {ASSET_ACTION, Identified} from "../service/network/Asset";
import NetworkAssetsManager from "../service/network/NetworkAssetsManager";

export class NetworkGameStates {

    public networkGameManager: NetworkGameRules = new NetworkGameRules();

    /* networked items model*/
    public player: Ship;
    public otherPlayer: { [id: string]: Ship; };
    public asteroids: { [id: string]: Asteroid; };

    public netWorkAssetManager: NetworkAssetsManager = new NetworkAssetsManager();

    constructor(public scene: Phaser.Scene, public apiServerAdd: string, player: Ship, name: string) {
        this.player = player;
        this.otherPlayer = {};
        this.asteroids = {};

        let asteroidPayloadConverter: AsteroidPayloadConverter = new AsteroidPayloadConverter(this.scene, this.asteroids);
        let shipPayloadConverter: ShipPayloadConverter = new ShipPayloadConverter(this.scene, this.player, this.otherPlayer);
        let bulletPayloadConverter: BulletPayloadConverter = new BulletPayloadConverter(this.player, this.otherPlayer);

        this.netWorkAssetManager.bootServices(apiServerAdd + "/broadcaster");
        this.netWorkAssetManager.bootServices(apiServerAdd + "/distributed");
        this.netWorkAssetManager.registerNetworkAssets("player/", apiServerAdd + "/broadcaster", shipPayloadConverter);
        this.netWorkAssetManager.registerNetworkAssets("bullet/", apiServerAdd + "/broadcaster", bulletPayloadConverter);
        this.netWorkAssetManager.registerNetworkAssets("asteroid/", apiServerAdd + "/distributed", asteroidPayloadConverter);

        this.netWorkAssetManager.createAsset(this.player);

        this.networkGameManager.start(apiServerAdd + "/asteroid", apiServerAdd, player.id, name);
    }

    createAsset(asset: Identified) {
        this.netWorkAssetManager.createAsset(asset);
    }

    createOrUpdateAsset(asset: Identified) {
        this.netWorkAssetManager.createOrUpdateAsset(asset);
    }

    updateAsset(asset: Identified) {
        this.netWorkAssetManager.updateAsset(asset);
    }

    deleteAsset(asset: Identified) {
        this.netWorkAssetManager.deleteAsset(asset);
    }

}