import {
  AnyDomainModel,
  DomainModelClass,
  ModelPropsValidateFn,
  defineModelPropGettersValidator,
} from "..";

export const PropsValidator = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  key: string,
  propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidateFn<T>>
) => {
  defineModelPropGettersValidator(target, {
    validate: propertyDescriptor.value!.bind(target),
  });
};
