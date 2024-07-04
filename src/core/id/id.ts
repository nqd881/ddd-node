import { Prop } from "../../model";
import { ValueObjectBase } from "../value-object";

export interface IdProps {
  value: string;
}

export class Id extends ValueObjectBase<IdProps> {
  constructor(idOrValue: Id | string) {
    super({ value: idOrValue instanceof Id ? idOrValue.value : idOrValue });
  }

  @Prop()
  declare value: string;
}
