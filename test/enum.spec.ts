import { expect } from "chai";
import { Enum, EnumBase } from "../src";

class Status extends EnumBase {
  @Enum("active")
  static Active: Status;

  @Enum("inactive")
  static Inactive: Status;
}

describe("Enum", function () {
  it("values()", () => {
    expect(Status.values().length).to.equal(2);
  });

  it("parse()", () => {
    const activeStatus = () => Status.parse("active");
    const invalidActiveStatus = () => Status.parse("ACTIVE");

    expect(activeStatus).not.throw();
    expect(invalidActiveStatus).throw();

    expect(activeStatus()).to.equal(Status.Active);
  });

  it("parseSafe()", () => {
    const invalidActiveStatus = () => Status.parseSafe("ACTIVE");

    expect(invalidActiveStatus).not.throw();
  });
});
