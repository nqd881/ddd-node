import { ModelClass } from "../../core";
import { setModelName } from "../../meta";

export const ModelName = (name?: string) => {
  return <T extends ModelClass>(target: T) => {
    setModelName(target, name);
  };
};
