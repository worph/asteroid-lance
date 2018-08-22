import {Component} from "../service/miniECS/Component";
import LanceAsset from "./shared/LanceAsset";

export class LancePhysicNetComponent implements Component{
    assetId:string;
    body : LanceAsset;
}