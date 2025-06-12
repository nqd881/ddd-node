"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBase = void 0;
const base_1 = require("../../../base");
const model_with_id_1 = require("../../model-with-id");
let MessageBase = class MessageBase extends model_with_id_1.ModelWithId {
    constructor(metadata, props) {
        super(metadata);
        this._timestamp = metadata.timestamp;
        this._causationId = metadata.causationId;
        this._correlationIds = metadata.correlationIds;
        this.initializeProps(props);
    }
    props() {
        return super.props();
    }
    metadata() {
        return Object.assign(Object.assign({}, super.metadata()), { timestamp: this._timestamp, correlationIds: this._correlationIds, causationId: this._causationId });
    }
    timestamp() {
        return this._timestamp;
    }
    correlationIds() {
        return this._correlationIds;
    }
    causationId() {
        return this._causationId;
    }
    setCausationId(causationId) {
        if (!this._causationId)
            this._causationId = causationId;
    }
    addCorrelationId(type, correlationId) {
        this._correlationIds[type] = correlationId;
    }
    setCorrelationIds(correlationIds) {
        this._correlationIds = correlationIds;
    }
};
exports.MessageBase = MessageBase;
exports.MessageBase = MessageBase = __decorate([
    (0, base_1.Mutable)(false),
    __metadata("design:paramtypes", [Object, Object])
], MessageBase);
