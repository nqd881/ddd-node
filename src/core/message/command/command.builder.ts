import { AnyCommand, CommandClassWithTypedConstructor } from "./command";
import { MessageBuilderBase } from "../message-base";

export class CommandBuilder<
  T extends AnyCommand
> extends MessageBuilderBase<T> {
  constructor(private commandClass: CommandClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    if (!this.props) throw new Error("The props must be set before build");

    return new this.commandClass(
      {
        id: this.id,
        timestamp: this.timestamp,
        causationId: this.causationId,
        correlationIds: this.correlationIds,
      },
      this.props
    );
  }
}
