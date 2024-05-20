import { ClassStatic } from "../../types";
import { Class } from "type-fest";
import { Props, PropsOf } from "../model";
import { MessageBase, MessageContext, MessageMetadata } from "./message";

export interface CommandMetadata extends Omit<MessageMetadata, "messageType"> {}

export class CommandBase<P extends Props> extends MessageBase<P> {
  static readonly COMMAND_MESSAGE_TYPE = "command";

  private _commandType: string;

  constructor(metadata: CommandMetadata, props: P) {
    super(
      { ...metadata, messageType: CommandBase.COMMAND_MESSAGE_TYPE },
      props
    );

    this._commandType = this.modelName();
  }

  static newCommand<T extends AnyCommand>(
    this: CommandClassWithTypedConstructor<T>,
    props: PropsOf<T>,
    context?: MessageContext,
    timestamp?: number
  ) {
    return new this(
      {
        id: this.id(),
        context,
        timestamp,
      },
      props
    );
  }

  getCommandType() {
    this._commandType;
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
