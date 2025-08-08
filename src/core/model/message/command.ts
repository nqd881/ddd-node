import { Class } from "type-fest";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { CommandType, getCommandType } from "../../meta";
import {
  Message,
  MessageClass,
  MessageMetadata,
  MessageMetadataInput,
} from "./message";

export interface CommandMetadata extends MessageMetadata {
  commandType: CommandType;
}

export class Command<P extends Props> extends Message<P> {
  static build<T extends AnyCommand>(
    this: CommandClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    metadata?: MessageMetadataInput
  ) {
    return new this(this.createMetadata(metadata), props);
  }

  static commandType<T extends AnyCommand>(this: CommandClass<T>) {
    return getCommandType(this);
  }

  protected readonly _commandType: CommandType;

  constructor(metadata: Omit<CommandMetadata, "commandType">, props: P) {
    super(metadata, props);

    this._commandType = this._constructor().commandType();
  }

  _constructor() {
    return this.constructor as CommandClass<typeof this>;
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

export type AnyCommand = Command<Props>;

export type CommandClass<
  T extends AnyCommand = AnyCommand,
  Arguments extends unknown[] = any[]
> = MessageClass<T> &
  Class<T, Arguments> &
  ClassStatic<typeof Command<InferredProps<T>>>;

export type CommandClassWithTypedConstructor<
  T extends AnyCommand = AnyCommand
> = CommandClass<T, ConstructorParameters<typeof Command<InferredProps<T>>>>;
