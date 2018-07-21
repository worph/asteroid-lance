import {ASSET_EVENT, Asset, ASSET_ACTION} from "./Asset";

import * as SocketIO from "socket.io"
import * as EventEmitter from "eventemitter3";

export default class DistributedAssetsLocator {

    finalAssets: { [id: string]: Asset; } = {};
    tmpAssets: { [id: string]: { [id: string]: Asset; }; } = {};
    step: number;
    stepTimeMs: number = 30;//millisecond
    startTime: Date;
    currentTime: Date;
    eventEmitter = new EventEmitter();
    io: SocketIO.Server;

    start(io: SocketIO.Server) {
        this.io = io.of('/distributed');
        this.startTime = new Date();
        this.step = 0;
        this.io.on('connection', (socket) => {
            console.log('a user connected: ', socket.id);
            // send all the current assets to the connected user
            socket.emit(ASSET_EVENT.INIT, {
                assets: this.finalAssets,
                currentTime: this.currentTime,
                step: this.step
            });

            // when a player disconnects, remove them from our players object
            socket.on('disconnect', () => {
                console.log('user disconnected: ', socket.id);
                // emit a message to all players to remove this player
                this.io.emit("disconnect", socket.id);
            });

            //update asset
            socket.on(ASSET_ACTION.UPDATE, (asset: Asset) => {
                this.updateAsset(asset,socket);
            });

            // create or update asset
            socket.on(ASSET_ACTION.CREATE_OR_UPDATE, (asset: Asset) => {
                if(this.finalAssets[asset.id]==undefined){
                    this.createAsset(asset,socket);
                }else {
                    this.updateAsset(asset,socket);
                }
            });

            // create asset
            socket.on(ASSET_ACTION.CREATE, (asset: Asset) => {
                //No consensus needed for asset creation
                this.createAsset(asset,socket);
            });

            // delete asset
            socket.on(ASSET_ACTION.DELETE, (asset: Asset) => {
                //No consensus needed for asset deletion
                this.deleteAsset(asset,socket);
            });

        });
        //set up main update
        setInterval(() => {
            this.update()
        }, this.stepTimeMs);
    }

    update() {
        let workingObject = this.tmpAssets;
        this.tmpAssets = {};//disconnect form current object
        this.currentTime = new Date();
        this.step++;
        Object.keys(workingObject).forEach(assetId => {
            //make a mean between the value sent by all the client.
            let currentAssets = workingObject[assetId];
            let finalValue: number[] = [];
            for (let i = 0; i < this.finalAssets[assetId].value.length; i++) {
                finalValue.push(0);
            }
            //TODO manage when client do not have the same size of value
            let lastKey:string = "";
            Object.keys(currentAssets).forEach(clientId => {
                let currentAsset: Asset = currentAssets[clientId];
                if(lastKey!==""){
                    if(currentAssets[lastKey].value.length!=currentAsset.value.length){
                        console.error("value mismatch : "+currentAssets[lastKey].value.length+" / "+currentAsset.value.length);
                    }
                }
                lastKey = clientId;
                currentAsset.value.forEach((value, index, array) => {
                    finalValue[index] += array[index];
                });
            });
            let clientNumber = Object.keys(currentAssets).length;
            for (let i = 0; i < this.finalAssets[assetId].value.length; i++) {
                finalValue[i] = finalValue[i] / clientNumber;
            }
            this.finalAssets[assetId] = {id: assetId, value: finalValue};
            //broadcast this value as volatile value
            this.io.volatile.emit(ASSET_EVENT.UPDATED, this.finalAssets[assetId]);
        })

    }

    createAsset(asset:Asset,socket:any){
        this.finalAssets[asset.id] = asset;
        if(socket==undefined) {
            this.io.emit(ASSET_EVENT.CREATED, asset);
        }else{
            socket.broadcast.emit(ASSET_EVENT.CREATED, asset);
        }
        this.eventEmitter.emit(ASSET_EVENT.CREATED, asset);
    }

    deleteAsset(asset:Asset,socket:any){
        if(this.finalAssets[asset.id]!=undefined) {
            delete this.tmpAssets[asset.id];
            delete this.finalAssets[asset.id];
            if (socket == undefined) {
                this.io.emit(ASSET_EVENT.DELETED, asset);
            } else {
                socket.broadcast.emit(ASSET_EVENT.DELETED, asset);
            }
            this.eventEmitter.emit(ASSET_EVENT.DELETED, asset);
        }
    }

    updateAsset(asset:Asset,socket:any){
        let current = this.finalAssets[asset.id];
        if(current==undefined){
            console.error("Asset not created");
        }else {
            if(current.value.length!=asset.value.length){
                console.error("value mismatch 2 : "+current.value.length+" / "+asset.value.length);
            }
            let tmpAsset = this.tmpAssets[asset.id];
            if (tmpAsset === undefined) {
                this.tmpAssets[asset.id] = {};
                tmpAsset = this.tmpAssets[asset.id]
            }
            tmpAsset[socket.id] = asset;
        }
    }


    on(event:string,callback: (asset: Asset) => void): () => void {
        this.eventEmitter.on(event, callback);
        return () => {
            this.eventEmitter.off(event, callback);
        };
    }

}
