import { AnyModel } from "./model";
import {
  ModelId,
  ModelName,
  ModelVersion,
  PropsMap,
  PropsValidator,
  StaticValuesMap,
} from "../meta";

export interface ModelDescriptor<T extends AnyModel = AnyModel> {
  modelId: ModelId;
  modelName: ModelName;
  modelVersion: ModelVersion;
  modelMutable: boolean;
  ownPropsValidator?: PropsValidator<T>;
  propsValidators: PropsValidator[];
  ownStaticValues: StaticValuesMap<T>;
  ownPropsMap: PropsMap<T>;
  propsMap: PropsMap<T>;
}
