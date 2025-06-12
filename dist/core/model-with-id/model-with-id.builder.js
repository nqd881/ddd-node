"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelWithIdBuilder = void 0;
const uuid_1 = require("uuid");
const base_1 = require("../../base");
class ModelWithIdBuilder extends base_1.ModelBuilder {
    constructor() {
        super(...arguments);
        this.id = this.newId();
    }
    newId() {
        return (0, uuid_1.v4)();
    }
    withId(id) {
        this.id = id;
        return this;
    }
    withNewId() {
        return this.withId(this.newId());
    }
}
exports.ModelWithIdBuilder = ModelWithIdBuilder;
