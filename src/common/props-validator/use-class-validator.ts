import { plainToInstance } from "class-transformer";
import {
  validateSync,
  ValidationError,
  ValidatorOptions,
} from "class-validator";
import { Class } from "type-fest";
import {
  AnyDomainModel,
  defineModelPropsValidator,
  DomainModelClass,
  getModelPropsType,
  InferredProps,
  ModelPropsValidator,
  ModelPropsValidatorBuilder,
  ModelPropsValidatorWrapper,
} from "../../base";

/* @UseClassValidator must be placed above @Model for it to work correctly */
export function UseClassValidator<T extends AnyDomainModel>(
  validatorOptions?: ValidatorOptions
): ClassDecorator;
export function UseClassValidator<T extends AnyDomainModel>(
  propsType: Class<InferredProps<T>>,
  validatorOptions?: ValidatorOptions
): ClassDecorator;
export function UseClassValidator<T extends AnyDomainModel>(
  p1?: Class<InferredProps<T>> | ValidatorOptions,
  p2?: ValidatorOptions
): ClassDecorator {
  return ((target: DomainModelClass<T>) => {
    const { propsType, validatorOptions } = resolveUseClassValidatorArgs(
      p1,
      p2,
      target
    );

    const builder: ModelPropsValidatorBuilder<T> = () =>
      new ClassValidatorModelPropsValidator(propsType, validatorOptions);

    defineModelPropsValidator(target, new ModelPropsValidatorWrapper(builder));
  }) as ClassDecorator;
}

/**
 * Internal helper for resolving @UseClassValidator overloads.
 */
function resolveUseClassValidatorArgs<T extends AnyDomainModel>(
  p1: Class<InferredProps<T>> | ValidatorOptions | undefined,
  p2: ValidatorOptions | undefined,
  target: DomainModelClass<T>
) {
  let propsType: Class<InferredProps<T>> | undefined;
  let validatorOptions: ValidatorOptions | undefined;

  if (typeof p1 === "function") {
    propsType = p1;
    validatorOptions = p2;
  } else {
    validatorOptions = p1;
  }

  propsType ??= getModelPropsType(target);

  if (!propsType) {
    throw new Error(
      `Props type must be provided or defined for ${target.name}`
    );
  }

  return { propsType, validatorOptions };
}
export class ClassValidatorError extends Error {
  static getErrorMessage(errors: ValidationError[]) {
    return errors
      .map((error) => Object.values(error.constraints || {}).join(", "))
      .join("\n");
  }

  constructor(public readonly errors: ValidationError[]) {
    super(ClassValidatorError.getErrorMessage(errors));
  }
}

export class ClassValidatorModelPropsValidator<T extends AnyDomainModel>
  implements ModelPropsValidator<T>
{
  constructor(
    public readonly propsClass: Class<InferredProps<T>>,
    public readonly validatorOptions?: ValidatorOptions
  ) {}

  transform(props: InferredProps<T>) {
    return plainToInstance(this.propsClass, props);
  }

  validate(props: InferredProps<T>): void {
    const transformedProps = this.transform(props);

    const errors = validateSync(transformedProps, this.validatorOptions);

    if (errors.length) {
      throw new ClassValidatorError(errors);
    }
  }
}
