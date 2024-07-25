import _ from "lodash";
import { AnyModel, ModelClass } from "../model";
import { Domain, domainManager } from "../domain";
import {
  PropsValidator,
  defineModelDomain,
  defineModelName,
  defineModelVersion,
  definePropsValidator,
  getModelDomain,
} from "../meta";

export type ModelOptions<T extends AnyModel = AnyModel> = {
  name?: string;
  version?: number;
  domain?: string;
  propsValidator?: PropsValidator<T>;
  autoRegisterModel?: boolean;
};

export function Model<
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(options?: ModelOptions<I>): any;
export function Model<
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(name: string, options?: ModelOptions<I>): any;
export function Model<
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(name: string, version: number, options?: ModelOptions<I>): any;
export function Model<
  T extends ModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  p1?: string | ModelOptions<I>,
  p2?: number | ModelOptions<I>,
  p3?: ModelOptions<I>
): any {
  const defaultModelOptions: ModelOptions = {
    autoRegisterModel: true,
  };

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

      if (!domainManager.hasDomain(domainName)) {
        domainManager.addDomain(new Domain(domainName));
      }

      const domain = domainManager.getDomain(domainName)!;

      domain.modelRegistry.registerModel(target);
    }

    if (modelOptions?.propsValidator)
      definePropsValidator(target, modelOptions.propsValidator);
  };
}
