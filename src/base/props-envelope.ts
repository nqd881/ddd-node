import _ from "lodash";

export class PropsEnvelope<P extends object> {
  private _props: P;

  constructor(props?: P) {
    if (props) this.initProps(props);
  }

  validate(): void {}

  initProps(props: P) {
    if (this.props) return;

    this._props = props;

    this.validate();
  }

  protected get props() {
    return this._props;
  }

  getProps() {
    return _.cloneDeep(this._props);
  }
}

export type PropsOf<T extends PropsEnvelope<object>> = T extends PropsEnvelope<
  infer P
>
  ? P
  : never;
