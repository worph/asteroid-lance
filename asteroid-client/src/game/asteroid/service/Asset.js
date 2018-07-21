"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ASSET_EVENT {
}
ASSET_EVENT.CREATED = "assetCreated";
ASSET_EVENT.UPDATED = "assetUpdated";
ASSET_EVENT.DELETED = "assetDeleted";
ASSET_EVENT.INIT = "initAssets";
exports.ASSET_EVENT = ASSET_EVENT;
class ASSET_ACTION {
}
ASSET_ACTION.CREATE_OR_UPDATE = "createOrUpdateAsset";
ASSET_ACTION.CREATE = "createAsset";
ASSET_ACTION.UPDATE = "updateAsset";
ASSET_ACTION.DELETE = "deleteAsset";
exports.ASSET_ACTION = ASSET_ACTION;
