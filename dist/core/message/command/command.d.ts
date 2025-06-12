import { Class } from "type-fest";
import { CommandType } from "../../../meta";
import { Props, InferredProps } from "../../../base";
import { ClassStatic } from "../../../types";
import { MessageBase, MessageMetadata } from "../message-base";
import { CommandModelDescriptor } from "./command-model-descriptor";
import { CommandBuilder } from ".";
export interface CommandMetadata extends MessageMetadata {
    commandType: CommandType;
}
export declare class CommandBase<P extends Props> extends MessageBase<P> {
    static builder<T extends AnyCommand>(this: CommandClass<T>): CommandBuilder<T>;
    protected readonly _commandType: CommandType;
    static commandType(): string;
    constructor(metadata: Omit<CommandMetadata, "commandType">, props: P);
    modelDescriptor(): CommandModelDescriptor<typeof this>;
    metadata(): CommandMetadata;
    commandType(): string;
}
export type AnyCommand = CommandBase<Props>;
export interface CommandClass<T extends AnyCommand = AnyCommand, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof CommandBase<InferredProps<T>>> {
}
export interface CommandClassWithTypedConstructor<T extends AnyCommand = AnyCommand> extends CommandClass<T, ConstructorParameters<typeof CommandBase<InferredProps<T>>>> {
}
