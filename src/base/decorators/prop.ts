import { AnyDomainModel, InferredProps } from "../model";
import { PropertyConverter, registerPropertyAccessor } from "../meta";

export function Prop<T extends AnyDomainModel>(
  propTargetKey?: keyof InferredProps<T>,
  converter?: PropertyConverter
): PropertyDecorator;
export function Prop<T extends AnyDomainModel>(
  converter?: PropertyConverter
): PropertyDecorator;
export function Prop<T extends AnyDomainModel>(
  p1?: keyof InferredProps<T> | PropertyConverter,
  p2?: PropertyConverter
): PropertyDecorator {
  let propTargetKey: keyof InferredProps<T>, converter: PropertyConverter;

  return ((target: T, key: PropertyKey) => {
    if (!p1 && !p2) {
      propTargetKey = key;
    } else if (p1 && !p2) {
      if (typeof p1 === "function") {
        propTargetKey = key;
        converter = p1;
      } else {
        propTargetKey = p1;
      }
    } else if (p1 && p2) {
      propTargetKey = p1 as any;
      converter = p2;
    }

    registerPropertyAccessor(target, key, propTargetKey, converter);
  }) as PropertyDecorator;
}
