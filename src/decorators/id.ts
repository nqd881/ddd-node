import { IdGenerator, defineIdGenerator } from "#core";

export const id = <T extends IdGenerator>(idGenerator: T) => {
  return (target: object) => {
    console.log("Target", target);

    defineIdGenerator(target, idGenerator);
  };
};
