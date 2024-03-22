import { EntityClass, EntityType } from "#core";
import { model } from "./model";

export const entity =
  (name?: string) =>
  <T extends EntityClass>(target: T) => {
    const entityType = new EntityType(name ?? target.name);

    model(entityType.value)(target);
  };
