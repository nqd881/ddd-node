import { AnyModel } from "./model";
import { ModelId, ModelName, ModelVersion, ModelPropsMap, ModelPropsValidator, ModelStaticValuesMap } from "../meta";
export interface ModelDescriptor<T extends AnyModel = AnyModel> {
    modelId: ModelId;
    modelName: ModelName;
    modelVersion: ModelVersion;
    modelMutable: boolean;
    ownModelPropsValidator?: ModelPropsValidator<T>;
    modelPropsValidators: ModelPropsValidator[];
    ownModelStaticValues: ModelStaticValuesMap<T>;
    ownModelPropsMap: ModelPropsMap<T>;
    modelPropsMap: ModelPropsMap<T>;
}
