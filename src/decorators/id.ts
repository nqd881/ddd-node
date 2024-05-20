import { defineIdService } from "../meta";
import { AnyModelWithId, IIdService, ModelClass } from "../core";

export const UseIdService = (idService: IIdService) => {
  return <T extends AnyModelWithId>(target: ModelClass<T>) => {
    defineIdService(target, idService);
  };
};
