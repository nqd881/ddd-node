import { Class } from "type-fest";
import { DomainModel, InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id } from "./id";

export class IdentifiedModel<P extends Props> extends DomainModel<P> {
  private _id: Id;

  constructor(id: Id) {
    super();

    if (id) this.setId(id);
  }

  get id() {
    return this._id;
  }

  setId(id: Id) {
    this._id = id;
  }

  hasId(id: Id) {
    return this._id === id;
  }
}

export type AnyIdentifiedModel = IdentifiedModel<Props>;

export interface IdentifiedModelClass<
  T extends AnyIdentifiedModel = AnyIdentifiedModel,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof IdentifiedModel<InferredProps<T>>> {}

export interface IdentifiedModelClassWithTypedConstructor<
  T extends AnyIdentifiedModel = AnyIdentifiedModel
> extends IdentifiedModelClass<
    T,
    ConstructorParameters<typeof IdentifiedModel<InferredProps<T>>>
  > {}
