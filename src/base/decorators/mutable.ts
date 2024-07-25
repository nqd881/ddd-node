import { AbstractModelClass, ModelClass } from "../model";
import { defineModelMutable } from "../meta";

export const Mutable = (mutable: boolean = true) => {
  return <T extends ModelClass | AbstractModelClass>(target: T) => {
    defineModelMutable(target, mutable);
  };
};
