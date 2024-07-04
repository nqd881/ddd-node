import { ModelBase, Props } from "../../model";
import { Id } from "../id";

export interface IdentifiableModelMetadata {
  id: Id;
}

export class IdentifiableModel<P extends Props> extends ModelBase<P> {
  protected readonly _id: Id;

  constructor(metadata: IdentifiableModelMetadata) {
    super();

    this._id = metadata.id;
  }

  id() {
    return this._id;
  }

  hasId(id: Id) {
    return this._id.equals(id);
  }
}

export type AnyIdentifiableModel = IdentifiableModel<Props>;
