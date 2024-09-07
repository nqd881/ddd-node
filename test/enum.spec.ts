import { expect } from "chai";
import { Enum, EnumBase, EnumBuilder } from "../src";

class Status extends EnumBase {
  @Enum()
  static Active: Status;

  @Enum("inactive")
  static Inactive: Status;
}

const StatusBuilder = () => new EnumBuilder(Status);

describe("Enum", function () {
  it("correct value", () => {
    expect(Status.Inactive.value).to.equal("inactive");
  });

  it("values()", () => {
    expect(Status.values().length).to.equal(2);
  });

  it("comparable", () => {
    expect(Status.Active === Status.Active).to.be.true;
    expect(Status.Active).to.equal(Status.Active);
  });

  it("parse()", () => {
    const activeStatus = () => StatusBuilder().withValue("Active").build();

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
