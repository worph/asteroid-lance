import {ASSET_EVENT, ASSET_ACTION, Identified, Asset} from "./Asset";
import * as SocketIO from "socket.io"

export default class BroadcasterService {

    assets: { [id: string]: Identified; } = {};
    io: SocketIO.Server;

    deleteAssetById(assetId: string) {
        this.io.emit(ASSET_EVENT.DELETED, {
            id: assetId,
            value: []
        });
        delete this.assets[assetId];
    }

    createAsset(asset, socket) {
        //No consensus needed for asset creation
        socket.broadcast.emit(ASSET_EVENT.CREATED, asset);
        this.assets[asset.id] = asset;
    }

    updateAsset(asset, socket) {
        this.assets[asset.id] = asset;
        socket.broadcast.volatile.emit(ASSET_EVENT.UPDATED, asset);

    }

    deleteAsset(asset, socket) {
        //No consensus needed for asset deletion
        if (socket == undefined) {
            this.io.emit(ASSET_EVENT.DELETED, asset);
        } else {
            socket.broadcast.emit(ASSET_EVENT.DELETED, asset);
        }
        delete this.assets[asset.id];

    }

    start(io: SocketIO.Server) {
        this.io = io.of('/broadcaster');
        this.io.on('connection', (socket) => {
            console.log('a user connected: ', socket.id);
            // send all the current assets to the connected user
            socket.emit(ASSET_EVENT.INIT, {assets: this.assets});

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id);
                // emit a message to all players to remove this player
                this.io.emit("disconnect", socket.id);
            });

            // create asset
            socket.on(ASSET_ACTION.CREATE, (asset: Identified) => {
                this.createAsset(asset, socket);
            });

            //update asset
            socket.on(ASSET_ACTION.UPDATE, (asset: Identified) => {
                this.updateAsset(asset, socket);
            });

            // create or update asset
            socket.on(ASSET_ACTION.CREATE_OR_UPDATE, (asset: Asset) => {
                if (this.assets[asset.id] == undefined) {
                    this.createAsset(asset, socket);
                } else {
                    this.updateAsset(asset, socket);
                }
            });

            // delete asset
            socket.on(ASSET_ACTION.DELETE, (asset: Identified) => {
                this.deleteAsset(asset, socket);
            });

        });
    }
}
