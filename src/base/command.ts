import { getCommandType } from "#metadata/command";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id } from "./id";
import { IMessageMetadata, Message } from "./message";
import { PropsOf } from "./props-envelope";

export interface ICommandMetadata extends IMessageMetadata {
  readonly commandType: string;
}

export type NewCommandMetadataOptions = Omit<
  ICommandMetadata,
  "aggregateType" | "timestamp"
>;

export class Command<P extends object>
  extends Message<P>
  implements ICommandMetadata
{
  private readonly _commandType: string;

  constructor(metadata: ICommandMetadata, props: P) {
    super(metadata, props);

    this._commandType = metadata.commandType;
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
        commandType: this.commandType(),
        id: Id.unique(),
        timestamp: Date.now(),
        aggregateType: this.aggregateType(),
        ...metadata,
      },
      props
    );
  }

  get commandType() {
    return this._commandType;
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

export type AnyCommandClass = Class<AnyCommand>;
