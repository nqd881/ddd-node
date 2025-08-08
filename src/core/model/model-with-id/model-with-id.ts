import { Id } from "./id";
import { DomainModel, Props } from "../../../base";

export interface ModelWithIdMetadata {
  id: Id;
}

export class ModelWithId<P extends Props> extends DomainModel<P> {
  protected readonly _id: Id;

  constructor(metadata: ModelWithIdMetadata) {
    super();

    this._id = metadata.id;
  }

  override metadata(): ModelWithIdMetadata {
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

export type AnyModelWithId = ModelWithId<Props>;
