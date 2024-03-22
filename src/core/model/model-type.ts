import { Class, ClassStatic } from "#types";

export const seperator = "#" as const;

export type ModelTypePattern<Prefix extends string = string> =
  `${Prefix}${typeof seperator}${string}`;

export const ModelTypePatternRegex = new RegExp(".+" + seperator + ".+");

export class ModelType<Prefix extends string = string> {
  constructor(readonly prefix: Prefix, readonly name: string) {}

  static from<Prefix extends string = string>(value: ModelTypePattern<Prefix>) {
    if (!this.isPattern(value)) throw new Error("Invalid value");

    const [prefix, ...names] = value.split(seperator);

    const name = names.join(seperator);

    return new ModelType<Prefix>(prefix as Prefix, name);
  }

  static isPattern(type: string): type is ModelTypePattern {
    return ModelTypePatternRegex.test(type);
  }

  get value(): ModelTypePattern<Prefix> {
    return `${this.prefix}${seperator}${this.name}`;
  }
}

export type PrefixOf<T extends ModelType> = T extends ModelType<infer Prefix>
  ? Prefix
  : never;

export type ModelTypeClass<T extends ModelType> = Class<T> &
  ClassStatic<typeof ModelType<PrefixOf<T>>>;

export type ModelTypePatternOf<T extends ModelType> = ModelTypePattern<
  PrefixOf<T>
>;

//

export const createPrefixedModelTypeClass = <Prefix extends string = string>(
  prefix: Prefix
) => {
  return class extends ModelType<Prefix> {
    constructor(name: string) {
      super(prefix, name);
    }
  };
};

//

export const EntityTypePrefix = "Entity" as const;

export class EntityType extends createPrefixedModelTypeClass(
  EntityTypePrefix
) {}

export const AggregateTypePrefix = "Aggregate" as const;

export class AggregateType extends createPrefixedModelTypeClass(
  AggregateTypePrefix
) {}

export const EventTypePrefix = "Event" as const;

export class EventType extends createPrefixedModelTypeClass(EventTypePrefix) {}

export const CommandTypePrefix = "Command" as const;

export class CommandType extends createPrefixedModelTypeClass(
  CommandTypePrefix
) {}

export const ValueObjectTypePrefix = "ValueObject" as const;

export class ValueObjectType extends createPrefixedModelTypeClass(
  ValueObjectTypePrefix
) {}
