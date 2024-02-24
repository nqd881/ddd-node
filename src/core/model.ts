import { Class } from "#types/class";
import _ from "lodash";
import { getModelType } from "./metadata";

export class Model<Props extends object> {
  protected _props: Props;

  constructor(props?: Props) {
    if (props) this.initializeProps(props);
  }

  static isModel(obj: object): obj is AnyModel {
    return obj instanceof Model;
  }

  static type() {
    return getModelType(this.prototype);
  }

  protected initializeProps(props: Props) {
    if (!this._props) {
      this._props = props;

      this.validate();
    }
  }

  validate(): void {}

  getType() {
    return getModelType(Object.getPrototypeOf(this));
  }

  props() {
    return _.cloneDeep(this._props);
  }
}

export type AnyModel = Model<object>;

export type PropsOf<T> = T extends Model<infer P> ? P : never;

export type ModelClass<T extends AnyModel = AnyModel> = Class<T>;

export type EmptyProps = {};
