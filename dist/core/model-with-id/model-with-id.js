"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelWithId = void 0;
const base_1 = require("../../base");
class ModelWithId extends base_1.ModelBase {
    constructor(metadata) {
        super();
        this._id = metadata.id;
    }
    metadata() {
        return Object.assign(Object.assign({}, super.metadata()), { id: this._id });
    }
    id() {
        return this._id;
    }
    hasId(id) {
        return this._id === id;
    }
}
exports.ModelWithId = ModelWithId;
