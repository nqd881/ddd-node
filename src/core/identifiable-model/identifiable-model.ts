import { Id } from "./id";
import { ModelBase, Props } from "../../model";

export interface IdentifiableModelMetadata {
  id: Id;
}

export class IdentifiableModel<P extends Props> extends ModelBase<P> {
  protected readonly _id: Id;

  constructor(metadata: IdentifiableModelMetadata) {
    super();

    this._id = metadata.id;
  }

  override metadata(): IdentifiableModelMetadata {
    return {
      ...super.metadata(),
      id: this._id,
    };
  }

  id() {
    return this._id;
  }

  hasId(id: Id) {
    return this._id === id;
  }
}

export type AnyIdentifiableModel = IdentifiableModel<Props>;
