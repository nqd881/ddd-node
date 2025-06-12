"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandHandlerMap = exports.CommandHandlerMapMetaKey = exports.defineCommandHandler = exports.getOwnCommandHandlerMap = exports.OwnCommandHandlerMapMetaKey = exports.CommandHandlerMap = void 0;
class CommandHandlerMap extends Map {
}
exports.CommandHandlerMap = CommandHandlerMap;
exports.OwnCommandHandlerMapMetaKey = Symbol.for("OWN_COMMAND_HANDLER_MAP");
const getOwnCommandHandlerMap = (target) => {
    const ownCommandHandlerMap = () => Reflect.getOwnMetadata(exports.OwnCommandHandlerMapMetaKey, target);
    if (!ownCommandHandlerMap())
        Reflect.defineMetadata(exports.OwnCommandHandlerMapMetaKey, new CommandHandlerMap(), target);
    return ownCommandHandlerMap();
};
exports.getOwnCommandHandlerMap = getOwnCommandHandlerMap;
const defineCommandHandler = (target, commandType, handler) => {
    const commandHandlersMap = (0, exports.getOwnCommandHandlerMap)(target);
    commandHandlersMap.set(commandType, handler);
};
exports.defineCommandHandler = defineCommandHandler;
exports.CommandHandlerMapMetaKey = Symbol.for("COMMAND_HANDLER_MAP");
const getCommandHandlerMap = (target) => {
    if (!Reflect.hasOwnMetadata(exports.CommandHandlerMapMetaKey, target)) {
        const buildCommandHandlerMap = (target) => {
            let _target = target;
            const result = new CommandHandlerMap();
            const ownCommandHandlerMaps = [];
            do {
                const ownCommandHandlerMap = (0, exports.getOwnCommandHandlerMap)(_target);
                ownCommandHandlerMaps.unshift(ownCommandHandlerMap);
                _target = Reflect.getPrototypeOf(_target);
            } while (_target !== null);
            ownCommandHandlerMaps.forEach((ownCommandHandlerMap) => {
                ownCommandHandlerMap.forEach((commandHandler, commandType) => {
                    result.set(commandType, commandHandler);
                });
            });
            return result;
        };
        Reflect.defineMetadata(exports.CommandHandlerMapMetaKey, buildCommandHandlerMap(target), target);
    }
    return Reflect.getOwnMetadata(exports.CommandHandlerMapMetaKey, target);
};
exports.getCommandHandlerMap = getCommandHandlerMap;
