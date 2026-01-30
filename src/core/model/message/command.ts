import { Class } from "type-fest";
import { v4 } from "uuid";
import { InferredProps, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { CommandType, getCommandType } from "../../meta";
import { Id } from "../identified-model";
import { CausationId, CorrelationIds, Message, MessageClass } from "./message";

export interface NewCommandOptions {
  id?: Id;
  causationId?: CausationId;
  correlationIds?: CorrelationIds;
}

export class Command<P extends Props> extends Message<P> {
  static new<T extends AnyCommand>(
    this: CommandClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    options?: NewCommandOptions
  ) {
    return new this(
      options?.id ?? v4(),
      Date.now(),
      props,
      options?.causationId,
      options?.correlationIds
    );
  }

  static commandType<T extends AnyCommand>(this: CommandClass<T>) {
    return getCommandType(this);
  }

  protected readonly _commandType: CommandType;

  constructor(
    id: Id,
    timestamp: number,
    props: P,
    causationId?: Id,
    correlationIds?: CorrelationIds
  ) {
    super(id, timestamp, props, causationId, correlationIds);

    this._commandType = this._constructor().commandType();
  }

  _constructor() {
    return this.constructor as CommandClass<typeof this>;
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
