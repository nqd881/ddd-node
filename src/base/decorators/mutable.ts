import { AbstractDomainModelClass, DomainModelClass } from "../model";
import { defineModelMutable } from "../meta";

export const Mutable = (mutable: boolean = true) => {
  return <T extends DomainModelClass | AbstractDomainModelClass>(target: T) => {
    defineModelMutable(target, mutable);
  };
};
