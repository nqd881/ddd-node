import { Class, ClassStatic } from "#types";
import { PropsOf } from "../model";
import { Message, MessageContext, MessageMetadata } from "./message";

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
        id: this.id(),
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
