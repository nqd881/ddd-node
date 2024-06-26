import { v4, validate, version } from "uuid";
import { IIdService } from "../interface";

export class Uuid4Service implements IIdService {
  validateValue(value: string): void {
    const isUuid = validate(value);
    const isV4 = version(value) === 4;

    if (!isUuid) throw new Error("Id value is invalid for uuid type");
    if (!isV4) throw new Error("Version of uuid value must be 4");
  }

  generateValue(): string {
    return v4();
  }
}
