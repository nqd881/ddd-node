import { expect } from "chai";
import { Enum, EnumBase, EnumBuilder } from "../src";

class Status extends EnumBase {
  @Enum("active")
  static Active: Status;

  @Enum("inactive")
  static Inactive: Status;
}

const StatusBuilder = () => new EnumBuilder(Status);

describe("Enum", function () {
  it("values()", () => {
    expect(Status.values().length).to.equal(2);
  });

  it("parse()", () => {
    const activeStatus = () => StatusBuilder().withValue("active").build();
    const invalidActiveStatus = () =>
      StatusBuilder().withValue("ACTIVE").build();

    expect(activeStatus).not.throw();
    expect(invalidActiveStatus).throw();

    expect(activeStatus()).to.equal(Status.Active);
  });

  it("parseSafe()", () => {
    const invalidActiveStatus = () =>
      StatusBuilder().withValue("ACTIVE").buildSafe();

    expect(invalidActiveStatus).not.throw();
  });
});
