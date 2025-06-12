import "reflect-metadata";
export type CommandType = string;
export declare class $CommandType extends String {
    static validate(commandType: string): void;
    constructor(commandType: CommandType);
}
export declare const defineCommandType: (target: object, commandType: CommandType) => void;
export declare const getCommandType: (target: object) => CommandType;
