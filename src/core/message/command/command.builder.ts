import { AnyCommand, CommandClassWithTypedConstructor } from "./command";
import { MessageBuilderBase } from "../message-base";

export class CommandBuilder<
  T extends AnyCommand
> extends MessageBuilderBase<T> {
  constructor(private commandClass: CommandClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    if (!this._props) throw new Error();

    return new this.commandClass(
      {
        id: this.getId(),
        timestamp: this.getTimestamp(),
        context: this._context,
      },
      this._props
    );
  }
}
