import { AnyModel, ModelClass, ModelPropsValidator } from "..";
export declare const PropsValidator: <T extends AnyModel>(target: ModelClass<T>, key: string, propertyDescriptor: TypedPropertyDescriptor<ModelPropsValidator<T>>) => void;
