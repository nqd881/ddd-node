import { AnyCommand } from "./command";
import { CommandType } from "../../../meta";
import { ModelDescriptor } from "../../../base";

export interface CommandModelDescriptor<T extends AnyCommand>
  extends ModelDescriptor<T> {
  commandType: CommandType;
}
