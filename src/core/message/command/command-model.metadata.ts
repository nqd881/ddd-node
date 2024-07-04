import { AnyCommand } from "./command";
import { CommandType } from "../../../meta";
import { IModelMetadata } from "../../../model";

export interface ICommandModelMetadata<T extends AnyCommand>
  extends IModelMetadata<T> {
  commandType: CommandType;
}
