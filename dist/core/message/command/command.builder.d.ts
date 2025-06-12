import { AnyCommand, CommandClassWithTypedConstructor } from "./command";
import { MessageBuilderBase } from "../message-base";
export declare class CommandBuilder<T extends AnyCommand> extends MessageBuilderBase<T> {
    private commandClass;
    constructor(commandClass: CommandClassWithTypedConstructor<T>);
    build(): T;
}
