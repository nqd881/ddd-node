import { AnyMessageClass } from "#base/message";
import { defineMessageAggregateType } from "#metadata/message";

export const TypeMessage = (aggregateType: string) => {
  return <U extends AnyMessageClass>(target: U) => {
    defineMessageAggregateType(target.prototype, aggregateType);
  };
};
