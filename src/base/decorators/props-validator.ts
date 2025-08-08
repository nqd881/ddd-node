import {
  AnyDomainModel,
  DomainModelClass,
  ModelPropsValidator,
  defineModelPropsValidator,
} from "..";

export const PropsValidator = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  key: string,
  propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidator<T>>
) => {
  defineModelPropsValidator(target, propertyDescriptor.value!);
};
