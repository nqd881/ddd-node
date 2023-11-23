import { getCommandType } from "#metadata/command";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id } from "./id";
import { PropsEnvelope, PropsOf } from "./props-envelope";

export interface ICommandMetadata {
  readonly id: Id;
  readonly timestamp: number;
  correlationId?: string;
  causationId?: string;
}

export type NewCommandMetadataOptions = Partial<
  Omit<ICommandMetadata, "timestamp">
>;

export class Command<P extends object>
  extends PropsEnvelope<P>
  implements ICommandMetadata
{
  private readonly _id: Id;
  private readonly _timestamp: number;
  private _correlationId?: string;
  private _causationId?: string;

  constructor(metadata: ICommandMetadata, props: P) {
    super(props);

    this._id = metadata.id;
    this._timestamp = metadata.timestamp;
    this._correlationId = metadata?.correlationId;
    this._causationId = metadata?.causationId;
  }

  static commandType() {
    return getCommandType(this.prototype);
  }

  static newCommand<T extends AnyCommand>(
    this: CommandClass<T>,
    props: PropsOf<T>,
    metadata?: NewCommandMetadataOptions
  ) {
    return new this(
      {
        id: Id.unique(),
        timestamp: Date.now(),
        ...metadata,
      },
      props
    );
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get correlationId() {
    return this._correlationId;
  }

  get causationId() {
    return this._causationId;
  }

  setCorrelationId(correlationId: string) {
    if (!this.correlationId) this._correlationId = correlationId;
  }

  setCausationId(causationId: string) {
    if (!this.causationId) this._causationId = causationId;
  }

  commandType() {
    const prototype = Object.getPrototypeOf(this);

    return getCommandType(prototype);
  }
}

export type AnyCommand = Command<any>;

export type CommandConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof Command<P>>;

export type CommandClassWithProps<P extends object> = Class<
  Command<P>,
  CommandConstructorParamsWithProps<P>
> &
  ClassStatic<typeof Command<P>>;

export type CommandConstructorParams<T extends AnyCommand> =
  CommandConstructorParamsWithProps<PropsOf<T>>;

export type CommandClass<T extends AnyCommand> = Class<
  T,
  CommandConstructorParams<T>
> &
  ClassStatic<typeof Command<PropsOf<T>>>;

export type AnyCommandClass = CommandClass<AnyCommand>;
