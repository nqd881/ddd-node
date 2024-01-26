import "reflect-metadata";
import { MESSAGE_AGGREGATE_TYPE } from "./constants";

export const defineMessageAggregateType = (
  target: object,
  aggregateType: string
) => {
  Reflect.defineMetadata(MESSAGE_AGGREGATE_TYPE, aggregateType, target);
};

export const getMessageAggregateType = (target: object): string => {
  const aggregateType = Reflect.getMetadata(MESSAGE_AGGREGATE_TYPE, target);

  if (!aggregateType) throw new Error();

  return aggregateType;
};
