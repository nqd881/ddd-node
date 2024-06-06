import { setModelVersion } from "../../meta";
import { ModelClass } from "../../core";

export const Version = (version: number) => {
  return <T extends ModelClass>(target: T) => {
    setModelVersion(target, version);
  };
};
