import { expect } from "chai";
import { describe, it } from "mocha";
import { Prop, ValueObjectBase } from "../src";

interface NicknameProps {
  value: string;
}

class Nickname extends ValueObjectBase<NicknameProps> {
  @Prop()
  declare value: string;
}

interface NameProps {
  firstName: string;
  lastName: string;
  nicknames: Nickname[];
}

class Name extends ValueObjectBase<NameProps> {
  @Prop()
  declare firstName: string;

  @Prop()
  declare lastName: string;

  @Prop()
  declare nicknames: Nickname[];

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

describe("Value Object", function () {
  const firstName = "Dai";
  const lastName = "Nguyen Quoc";

  const createName = (nicknames: string[] = []) =>
    new Name({
      firstName,
      lastName,
      nicknames: nicknames.map((nickname) => new Nickname({ value: nickname })),
    });

  it("create new instance", () => {
    expect(createName).to.not.throw;
  });

  it("compare instances using equals()", () => {
    const nameA = createName();
    const nameB = createName();

    expect(nameA.equals(nameB)).to.be.true;

    const nameC = createName(["nickname1", "nickname2"]);
    const nameD = createName(["nickname2", "nickname1"]);
    const nameE = createName(["nickname1", "nickname3"]);

    expect(nameC.equals(nameD)).to.be.true;
    expect(nameC.equals(nameE)).to.be.false;
  });

  it("create new instance using with()", () => {
    const nameA = createName();
    const nameB = nameA.with({ firstName: "Cuong" });

    expect(nameA).to.not.equal(nameB);
    expect(nameB.firstName).to.equal("Cuong");
    expect(nameB.lastName).to.equal(nameA.lastName);
  });
});
