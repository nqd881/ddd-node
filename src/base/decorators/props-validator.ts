import {
  AnyDomainModel,
  DomainModelClass,
  ModelPropsValidator,
  defineModelPropGettersValidator,
} from "..";

export const PropsValidator = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  key: string,
  propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidator<T>>
) => {
  defineModelPropGettersValidator(target, propertyDescriptor.value!);
};
