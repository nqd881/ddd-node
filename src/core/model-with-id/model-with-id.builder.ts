import { ModelBuilder } from "../../model";
import { IIdService, Id, Uuid4Service } from "../id";
import { AnyModelWithId } from "./model-with-id";

export abstract class ModelWithIdBuilder<
  T extends AnyModelWithId
> extends ModelBuilder<T> {
  protected _id?: Id;
  protected _idService?: IIdService;

  getIdService() {
    return this._idService ?? new Uuid4Service();
  }

  getId() {
    return this._id ?? new Id(this.getIdService().generateValue());
  }

  withId(id: Id) {
    this._id = id;

    return this;
  }

  withIdService(idService: IIdService) {
    this._idService = idService;

    return this;
  }
}
