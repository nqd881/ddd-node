import { AnyCommand, CommandHandler } from "../../core";
export declare class CommandHandlerMap extends Map<string, CommandHandler> {
}
export declare const OwnCommandHandlerMapMetaKey: unique symbol;
export declare const getOwnCommandHandlerMap: (target: object) => CommandHandlerMap;
export declare const defineCommandHandler: <T extends AnyCommand>(target: object, commandType: string, handler: CommandHandler<T>) => void;
export declare const CommandHandlerMapMetaKey: unique symbol;
export declare const getCommandHandlerMap: (target: object) => CommandHandlerMap;
