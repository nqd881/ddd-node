import { ModelClass } from "../core";
import { defineModelMutable } from "../meta";

export const Mutable = (mutable: boolean = true) => {
  return (target: ModelClass) => {
    defineModelMutable(target, mutable);
  };
};
