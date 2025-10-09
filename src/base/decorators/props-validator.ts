import {
  AnyDomainModel,
  DomainModelClass,
  ModelPropsValidateFn,
  ModelPropsValidatorWrapper,
  defineModelPropsValidator,
} from "..";

export const PropsValidator = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  key: string,
  propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidateFn<T>>
) => {
  defineModelPropsValidator(
    target,
    new ModelPropsValidatorWrapper(propertyDescriptor.value!.bind(target))
  );
};
