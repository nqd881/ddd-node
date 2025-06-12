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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ValueObjectBase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObjectBase = void 0;
const lodash_1 = __importDefault(require("lodash"));
const base_1 = require("../../base");
let ValueObjectBase = ValueObjectBase_1 = class ValueObjectBase extends base_1.ModelBase {
    constructor(props) {
        super();
        this.initializeProps(props);
    }
    props() {
        return super.props();
    }
    equals(vo) {
        const equalsType = vo instanceof this.constructor;
        const equalsValue = this.getEqualityValue() === vo.getEqualityValue();
        return equalsType && equalsValue;
    }
    with(props) {
        const newProps = lodash_1.default.merge(this.props(), props);
        return new this.constructor(newProps);
    }
    clone() {
        return this.with({});
    }
    getEqualityValue() {
        return JSON.stringify(this.getEqualityObject());
    }
    getEqualityObject() {
        const result = {};
        const props = this.props();
        const valueOf = (v) => v instanceof ValueObjectBase_1 ? v.getEqualityObject() : v;
        for (let [key, value] of Object.entries(props)) {
            if (Array.isArray(value)) {
                result[key] = value.map((v) => valueOf(v));
                const stringValueOf = (v) => JSON.stringify(v);
                result[key].sort((a, b) => {
                    return stringValueOf(a).localeCompare(stringValueOf(b));
                });
                continue;
            }
            result[key] = valueOf(value);
        }
        return result;
    }
};
exports.ValueObjectBase = ValueObjectBase;
exports.ValueObjectBase = ValueObjectBase = ValueObjectBase_1 = __decorate([
    (0, base_1.Mutable)(false),
    __metadata("design:paramtypes", [Object])
], ValueObjectBase);
