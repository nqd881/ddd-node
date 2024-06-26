import { Class } from "type-fest";
import { getCommandType } from "../../../meta";
import { Props, PropsOf } from "../../../model";
import { ClassStatic } from "../../../types";
import {
  MessageBase,
  MessageBuilderBase,
  MessageMetadata,
} from "../message-base";

export class CommandModelMetadata {
  constructor(private commandClass: CommandClass) {}

  get commandType() {
    return getCommandType(this.commandClass);
  }
}

export interface CommandMetadata extends Omit<MessageMetadata, "messageType"> {}

export class CommandBase<P extends Props> extends MessageBase<P> {
  static readonly COMMAND_MESSAGE_TYPE = "command";

  constructor(metadata: CommandMetadata, props: P) {
    super(
      { ...metadata, messageType: CommandBase.COMMAND_MESSAGE_TYPE },
      props
    );
  }

  static commandModelMetadata<T extends AnyCommand>(this: CommandClass<T>) {
    return new CommandModelMetadata(this);
  }

  commandModelMetadata() {
    return (this.constructor as CommandClass).commandModelMetadata();
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
