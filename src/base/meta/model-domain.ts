import { DEFAULT_DOMAIN, DomainName } from "../domain";
import { AnyDomainModel, DomainModelClass } from "../model";

export const ModelDomainMetaKey = Symbol.for("MODEL_DOMAIN");

export const defineModelDomain = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  domainName: DomainName
) => {
  Reflect.defineMetadata(ModelDomainMetaKey, domainName, target);
};

export const getModelDomain = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
) => {
  if (!Reflect.hasOwnMetadata(ModelDomainMetaKey, target))
    defineModelDomain(target, DEFAULT_DOMAIN);

  return Reflect.getOwnMetadata<DomainName>(ModelDomainMetaKey, target)!;
};
