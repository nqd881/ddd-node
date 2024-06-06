import { expect } from "chai";
import { describe } from "mocha";
import { Domain, Model, Prop, StateAggregateBase, Version } from "../src";

const PERSON_MODEL_NAME = "PERSON";

interface PersonProps {
  name: string;
}

@Model(PERSON_MODEL_NAME)
class Person extends StateAggregateBase<PersonProps> {
  @Prop()
  declare name: string;
}

interface Person1Props {
  name: string;
  age: number;
}

@Model(PERSON_MODEL_NAME)
@Version(1)
class Person1 extends StateAggregateBase<Person1Props> {
  @Prop()
  declare name: string;

  @Prop()
  declare age: number;
}

describe("Domain", function () {
  let domain: Domain = new Domain();

  it("Register success", () => {
    domain.registerModel(Person);

    expect(domain.getModelVersionRegistry(PERSON_MODEL_NAME).size).to.equal(1);

    expect(domain.getModel(PERSON_MODEL_NAME, 0)).to.equal(Person);

    expect(() => domain.registerModel(Person)).to.throw();

    domain.registerModel(Person1);

    expect(domain.getModelVersionRegistry(PERSON_MODEL_NAME).size).to.equal(2);

    expect(domain.getModel(PERSON_MODEL_NAME, 1)).to.equal(Person1);

    expect(domain.getModel(PERSON_MODEL_NAME)).to.equal(Person);
  });
});
