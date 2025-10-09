import { Class } from "type-fest";
import { Domain, DomainManager } from "../domain";
import {
  ModelPropsValidatorWrapper,
  ModelPropsValidatorWrapperInput,
  defineModelDomain,
  defineModelName,
  defineModelPropsType,
  defineModelPropsValidator,
  defineModelVersion,
  getModelDomain,
} from "../meta";
import { AnyDomainModel, DomainModelClass, InferredProps } from "../model";

export type ModelOptions<T extends AnyDomainModel = AnyDomainModel> = {
  name?: string;
  version?: number;
  domain?: string;
  propsValidator?: ModelPropsValidatorWrapperInput<T>;
  propsType?: Class<InferredProps<T>>;
  autoRegisterModel?: boolean;
};

export const DEFAULT_MODEL_OPTIONS: Required<
  Pick<ModelOptions, "autoRegisterModel">
> = {
  autoRegisterModel: true,
};

/**
 * @Model decorator — registers a DomainModel with metadata and domain context.
 *
 * Usage examples:
 *  @Model()
 *  @Model("User")
 *  @Model("User", 2)
 *  @Model("User", { domain: "Auth" })
 *  @Model("User", 2, { domain: "Auth" })
 */
export function Model<
  T extends DomainModelClass,
  I extends InstanceType<T> = InstanceType<T>
>(
  nameOrOptions?: string | ModelOptions<I>,
  versionOrOptions?: number | ModelOptions<I>,
  options?: ModelOptions<I>
) {
  const modelOptions = normalizeModelOptions(
    nameOrOptions,
    versionOrOptions,
    options
  );

  return (target: T) => {
    defineModel(target, modelOptions);

    if (modelOptions.autoRegisterModel) {
      registerModel(target);
    }
  };
}

/**
 * Normalizes decorator overload arguments into a unified ModelOptions object.
 */
function normalizeModelOptions<T extends AnyDomainModel>(
  p1?: string | ModelOptions<T>,
  p2?: number | ModelOptions<T>,
  p3?: ModelOptions<T>
): ModelOptions<T> {
  let options: ModelOptions<T> = {};

  if (typeof p1 === "string" && typeof p2 === "number") {
    options = { name: p1, version: p2, ...p3 };
  } else if (typeof p1 === "string" && typeof p2 === "object") {
    options = { name: p1, ...p2 };
  } else if (typeof p1 === "string") {
    options = { name: p1 };
  } else if (typeof p1 === "object") {
    options = { ...p1 };
  }

  return { ...DEFAULT_MODEL_OPTIONS, ...options };
}

/**
 * Defines model metadata such as name, version, domain, propsType, and validator.
 */
function defineModel<T extends DomainModelClass>(
  target: T,
  options: ModelOptions<InstanceType<T>>
) {
  if (options.name) defineModelName(target, options.name);
  if (options.version) defineModelVersion(target, options.version);
  if (options.domain) defineModelDomain(target, options.domain);

  if (options.propsValidator) {
    defineModelPropsValidator(
      target,
      new ModelPropsValidatorWrapper(options.propsValidator)
    );
  }

  if (options.propsType) {
    defineModelPropsType(target, options.propsType);
  }
}

/**
 * Registers the model in its associated domain via DomainManager.
 */
function registerModel<T extends DomainModelClass>(target: T) {
  const domainName = getModelDomain(target);
  const domainManager = DomainManager.instance();

  if (!domainManager.hasDomain(domainName)) {
    domainManager.addDomain(new Domain(domainName));
  }

  const domain = domainManager.getDomain(domainName)!;
  domain.modelRegistry.registerModel(target);
}
