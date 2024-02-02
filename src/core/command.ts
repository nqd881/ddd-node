import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Uuid4 } from "./id";
import { Message, MessageContext, MessageMetadata } from "./message";
import { PropsOf } from "./model";

export interface CommandMetadata extends MessageMetadata {}

export class Command<Props extends object> extends Message<Props> {
  constructor(metadata: CommandMetadata, props: Props) {
    super(metadata, props);
  }

  static newCommand<T extends AnyCommand>(
    this: CommandClassWithTypedConstructor<T>,
    props: PropsOf<T>,
    context?: MessageContext
  ) {
    return new this(
      {
        id: Uuid4.new(),
        timestamp: Date.now(),
        context,
      },
      props
    );
  }
}

export type AnyCommand = Command<any>;

export type CommandClass<
  T extends AnyCommand = AnyCommand,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof Command<PropsOf<T>>>;

export type CommandClassWithTypedConstructor<
  T extends AnyCommand = AnyCommand
> = CommandClass<T, ConstructorParameters<typeof Command<PropsOf<T>>>>;
