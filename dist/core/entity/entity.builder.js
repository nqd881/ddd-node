"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityBuilder = void 0;
const model_with_id_1 = require("../model-with-id");
class EntityBuilder extends model_with_id_1.ModelWithIdBuilder {
    constructor(entityClass) {
        super();
        this.entityClass = entityClass;
    }
    build() {
        if (!this.props)
            throw new Error("The props must be set before build");
        return new this.entityClass({ id: this.id }, this.props);
    }
}
exports.EntityBuilder = EntityBuilder;
