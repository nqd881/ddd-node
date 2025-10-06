import _ from "lodash";
import { Domain, DomainManager } from "../domain";
import {
  ModelPropsValidateFn,
  ModelPropsValidator,
  defineModelDomain,
  defineModelName,
  defineModelPropGettersValidator,
  defineModelVersion,
  getModelDomain,
} from "../meta";
import { AnyDomainModel, DomainModelClass } from "../model";

export type ModelOptions<T extends AnyDomainModel = AnyDomainModel> = {
  name?: string;
  version?: number;
  domain?: string;
  propsValidator?: ModelPropsValidator<T> | ModelPropsValidateFn<T>;
  autoRegisterModel?: boolean;
};

export const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  autoRegisterModel: true,
};

export function Model<
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(options?: ModelOptions<I>): any;
export function Model<
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(name: string, options?: ModelOptions<I>): any;
export function Model<
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(name: string, version: number, options?: ModelOptions<I>): any;
export function Model<
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  p1?: string | ModelOptions<I>,
  p2?: number | ModelOptions<I>,
  p3?: ModelOptions<I>
): any {
  const defaultModelOptions = _.clone(DEFAULT_MODEL_OPTIONS);

  let modelOptions: ModelOptions = {};

  if (p1 && !p2 && !p3) {
    if (typeof p1 === "string") modelOptions = { name: p1 };
    else modelOptions = p1;
  } else if (p1 && p2 && !p3) {
    if (typeof p2 === "number")
      modelOptions = { name: p1 as string, version: p2 };
    else modelOptions = { name: p1 as string, ...p2 };
  } else if (p1 && p2 && p3) {
    modelOptions = {
      name: p1 as string,
      version: p2 as number,
      ...p3,
    };
  }

  modelOptions = _.merge(defaultModelOptions, modelOptions);

  return (target: T) => {
    if (modelOptions?.name) defineModelName(target, modelOptions.name);

    if (modelOptions?.version) defineModelVersion(target, modelOptions.version);

    if (modelOptions?.domain) defineModelDomain(target, modelOptions.domain);

    if (modelOptions?.autoRegisterModel) {
      const domainName = getModelDomain(target);

      const domainManager = DomainManager.instance();

      if (!domainManager.hasDomain(domainName)) {
        domainManager.addDomain(new Domain(domainName));
      }

      const domain = domainManager.getDomain(domainName)!;

      domain.modelRegistry.registerModel(target);
    }

    if (modelOptions?.propsValidator) {
      if (typeof modelOptions.propsValidator === "function")
        defineModelPropGettersValidator(target, {
          validate: modelOptions.propsValidator,
        });
      else defineModelPropGettersValidator(target, modelOptions.propsValidator);
    }
  };
}
