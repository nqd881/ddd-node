import "reflect-metadata";
export type EventType = string;
export declare class $EventType extends String {
    static validate(eventType: string): void;
    constructor(eventType: EventType);
}
export declare const defineEventType: (target: object, eventType: EventType) => void;
export declare const getEventType: (target: object) => EventType;
