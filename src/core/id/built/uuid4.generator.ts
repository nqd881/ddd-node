import { v4, validate, version } from "uuid";
import { IdGenerator } from "../id-generator";

export class Uuid4Generator extends IdGenerator {
  generateValue() {
    return v4();
  }

  validateValue(value: string) {
    const isUuid = validate(value);
    const isV4 = version(value) === 4;

    return isUuid && isV4;
  }
}
