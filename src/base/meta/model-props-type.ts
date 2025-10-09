import { Class } from "type-fest";
import { AnyDomainModel, DomainModelClass, InferredProps } from "../model";

const MODEL_PROPS_TYPE = Symbol.for("MODEL_PROPS_TYPE");

export const defineModelPropsType = <T extends AnyDomainModel>(
  target: DomainModelClass<T>,
  propsType: Class<InferredProps<T>>
) => {
  Reflect.defineMetadata(MODEL_PROPS_TYPE, propsType, target);
};

export const getModelPropsType = <T extends AnyDomainModel>(
  target: DomainModelClass<T>
): Class<InferredProps<T>> | undefined => {
  return Reflect.getMetadata<Class<InferredProps<T>> | undefined>(
    MODEL_PROPS_TYPE,
    target
  );
};
