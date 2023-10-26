import { AnyEntity, EntityClass } from "#base/entity";
import { EntityRegistry, defineEntityType } from "#metadata/entity";

export const TypeEntity = <T extends AnyEntity>(entityType?: string) => {
  return <U extends EntityClass<T>>(target: U) => {
    entityType = entityType ?? target.name;

    defineEntityType(target.prototype, entityType);

    EntityRegistry.register(entityType, target);
  };
};
