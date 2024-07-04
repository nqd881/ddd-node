import { AnyModel } from "./model";
import {
  ModelId,
  ModelName,
  ModelVersion,
  PropsMap,
  PropsValidator,
  StaticValuesMap,
} from "../meta";

export interface IModelMetadata<T extends AnyModel = AnyModel> {
  modelMutable: boolean;
  modelId: ModelId;
  modelName: ModelName;
  modelVersion: ModelVersion;
  ownPropsValidator?: PropsValidator<T>;
  propsValidators: PropsValidator[];
  ownStaticValues: StaticValuesMap<T>;
  ownPropsMap: PropsMap<T>;
  propsMap: PropsMap<T>;
}
