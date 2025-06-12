import { AnyCommand, AnyEventSourcedAggregate, CommandClass, CommandHandler } from "../../core";
export declare const Handle: <T extends AnyCommand>(commandClass: CommandClass<T, any[]>) => <U extends CommandHandler<T>>(target: AnyEventSourcedAggregate, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) => void;
