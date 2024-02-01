import { EntityClass } from "#core/entity";
import { EntityType } from "#core/model-type";
import { model } from "./model";

export const entity =
  (name?: string) =>
  <T extends EntityClass>(target: T) => {
    const entityType = new EntityType(name ?? target.name);

    model(entityType.value)(target);
  };
