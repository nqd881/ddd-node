import { Snowflake, SnowflakeOpts } from "nodejs-snowflake";
import { IdGenerator } from "../id-generator";

export class SnowflakeGenerator extends IdGenerator {
  private snowflake: Snowflake;

  constructor(options?: SnowflakeOpts) {
    super();

    this.snowflake = new Snowflake(options);
  }

  generateValue(): string {
    return this.snowflake.getUniqueID().toString(16);
  }

  validateValue(value: string): void {}
}
