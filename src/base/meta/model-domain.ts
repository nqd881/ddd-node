import { DEFAULT_DOMAIN, DomainName } from "../domain";
import { AnyDomainModel, DomainModelClass } from "../model";

export const MODEL_DOMAIN = Symbol.for("MODEL_DOMAIN");

export const defineModelDomain = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  domainName: DomainName
) => {
  Reflect.defineMetadata(MODEL_DOMAIN, domainName, target);
};

export const getModelDomain = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
) => {
  if (!Reflect.hasOwnMetadata(MODEL_DOMAIN, target))
    defineModelDomain(target, DEFAULT_DOMAIN);

  return Reflect.getOwnMetadata<DomainName>(MODEL_DOMAIN, target)!;
};
