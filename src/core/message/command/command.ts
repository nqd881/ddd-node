import { Class } from "type-fest";
import { CommandType, getCommandType } from "../../../meta";
import { IModelMetadata, Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import { MessageBase, MessageMetadata } from "../message-base";

export interface ICommandModelMetadata<T extends AnyCommand>
  extends IModelMetadata<T> {
  commandType: CommandType;
}

export interface CommandMetadata extends MessageMetadata {}

export class CommandBase<P extends Props> extends MessageBase<P> {
  static commandType() {
    return getCommandType(this);
  }

  constructor(metadata: CommandMetadata, props: P) {
    super(metadata, props);
  }

  modelMetadata(): ICommandModelMetadata<typeof this> {
    const commandClass = this.constructor as CommandClass;

    return {
      ...super.modelMetadata(),
      commandType: commandClass.commandType(),
    };
  }
}

export type AnyCommand = CommandBase<Props>;

export interface CommandClass<
  T extends AnyCommand = AnyCommand,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof CommandBase<PropsOf<T>>> {}

export interface CommandClassWithTypedConstructor<
  T extends AnyCommand = AnyCommand
> extends CommandClass<
    T,
    ConstructorParameters<typeof CommandBase<PropsOf<T>>>
  > {}
