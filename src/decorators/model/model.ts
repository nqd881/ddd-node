import { ModelClass } from "../../core";
import { setModelName } from "../../meta";

export const Model = (name: string) => {
  return <T extends ModelClass>(target: T) => {
    setModelName(target, name);
  };
};
