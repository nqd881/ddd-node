import { expect } from "chai";
import { Enum, EnumBase, EnumBuilder } from "../src";

class Status extends EnumBase {
  @Enum()
  static Active: Status;

  @Enum("inactive")
  static Inactive: Status;
}

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

  it("build", () => {
    const activeStatus = () => Status.from("Active");

    const invalidActiveStatus = () => Status.from("ACTIVE");

    expect(activeStatus).not.throw();
    expect(invalidActiveStatus).throw();
    expect(activeStatus()).to.equal(Status.Active);
  });

  it("build safe", () => {
    const invalidActiveStatus = () => Status.fromSafe("ACTIVE");

    expect(invalidActiveStatus).not.throw();
    expect(invalidActiveStatus()).to.equal(null);
  });
});
