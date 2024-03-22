import { IdGenerator } from "#core/id";
import { defineIdGenerator } from "#core/metadata";

export const id = <T extends IdGenerator>(idGenerator: T) => {
  return (target: object) => {
    console.log("Target", target);

    defineIdGenerator(target, idGenerator);
  };
};
