import { Class } from "type-fest";
import { CommandType, getCommandType } from "../../../meta";
import { Props, PropsOf } from "../../../base";
import { ClassStatic } from "../../../types";
import { MessageBase, MessageMetadata } from "../message-base";
import { CommandModelDescriptor } from "./command-model-descriptor";
import { CommandBuilder } from ".";

export interface CommandMetadata extends MessageMetadata {
  commandType: CommandType;
}

export class CommandBase<P extends Props> extends MessageBase<P> {
  static builder<T extends AnyCommand>(
    this: CommandClass<T>
  ): CommandBuilder<T> {
    return new CommandBuilder(this);
  }

  protected readonly _commandType: CommandType;

  static commandType() {
    return getCommandType(this);
  }

  constructor(metadata: Omit<CommandMetadata, "commandType">, props: P) {
    super(metadata, props);

    this._commandType = getCommandType(this.constructor);
  }

  override modelDescriptor(): CommandModelDescriptor<typeof this> {
    const commandClass = this.constructor as CommandClass;

    return {
      ...super.modelDescriptor(),
      commandType: commandClass.commandType(),
    };
  }

  override metadata(): CommandMetadata {
    return {
      ...super.metadata(),
      commandType: this._commandType,
    };
  }

  commandType() {
    return this._commandType;
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
