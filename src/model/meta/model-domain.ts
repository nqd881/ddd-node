import { AnyModel, ModelClass } from "../core";

export const ModelDomainMetaKey = Symbol.for("MODEL_DOMAIN");

export const DEFAULT_MODEL_DOMAIN = "default";

export const defineModelDomain = <T extends AnyModel>(
  target: ModelClass<T>,
  domainName: string
) => {
  Reflect.defineMetadata(ModelDomainMetaKey, domainName, target);
};

export const getModelDomain = <T extends AnyModel>(target: ModelClass<T>) => {
  if (!Reflect.hasOwnMetadata(ModelDomainMetaKey, target))
    defineModelDomain(target, DEFAULT_MODEL_DOMAIN);

  return Reflect.getOwnMetadata<string>(ModelDomainMetaKey, target)!;
};
