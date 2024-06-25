import { defineIdService } from "../meta";
import { AnyModelWithId, IIdService } from "../core";
import { ModelClass } from "../model";

export const UseIdService = (idService: IIdService) => {
  return <T extends AnyModelWithId>(target: ModelClass<T>) => {
    defineIdService(target, idService);
  };
};
