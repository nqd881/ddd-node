import { AnyCommand, CommandClass } from "../../core";
import { CommandType } from "../../meta";
export declare const Command: (commandType: CommandType) => <T extends AnyCommand>(target: CommandClass<T, any[]>) => void;
