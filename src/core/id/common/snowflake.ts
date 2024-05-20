import { Snowflake, SnowflakeOpts } from "nodejs-snowflake";
import { IIdService } from "../interface";

export class SnowflakeIdService implements IIdService {
  private _snowflake: Snowflake;

  constructor(options?: SnowflakeOpts) {
    this._snowflake = new Snowflake(options);
  }

  validateValue(value: string): void {}

  generateValue(): string {
    return this._snowflake.getUniqueID().toString(16);
  }
}
