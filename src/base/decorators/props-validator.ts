import {
  AnyModel,
  ModelClass,
  ModelPropsValidator,
  defineModelPropsValidator,
} from "..";

export const PropsValidator = <T extends AnyModel>(
  target: ModelClass<T>,
  key: string,
  propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidator<T>>
) => {
  defineModelPropsValidator(target, propertyDescriptor.value!);
};
