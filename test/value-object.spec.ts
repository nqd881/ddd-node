import { expect } from "chai";
import { describe, it } from "mocha";
import { Prop, ValueObjectBase } from "../src";

interface NameProps {
  firstName: string;
  lastName: string;
}

export class Name extends ValueObjectBase<NameProps> {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe("Value Object", function () {
  const firstName = "Dai";
  const lastName = "Nguyen Quoc";
  const createName = () => new Name({ firstName, lastName });

  it("create new instance", () => {
    expect(createName).to.not.throw;
  });

  it("compare instances using equals()", () => {
    const nameA = createName();
    const nameB = createName();

    expect(nameA.equals(nameB)).to.be.true;
  });

  it("create new instance using with()", () => {
    const nameA = createName();
    const nameB = nameA.with({ firstName: "Cuong" });

    expect(nameA).to.not.equal(nameB);
    expect(nameB.firstName).to.equal("Cuong");
    expect(nameB.lastName).to.equal(nameA.lastName);
  });
});
