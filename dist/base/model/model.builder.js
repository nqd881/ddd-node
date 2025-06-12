"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelBuilder = void 0;
class ModelBuilder {
    withProps(props) {
        this.props = props;
        return this;
    }
    buildSafe() {
        try {
            return this.build();
        }
        catch (err) {
            return null;
        }
    }
}
exports.ModelBuilder = ModelBuilder;
