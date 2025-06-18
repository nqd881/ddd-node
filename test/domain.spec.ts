import { expect } from "chai";
import { describe } from "mocha";
import {
  Model,
  ModelRegistry,
  Prop,
  StateAggregateBase,
  domainManager,
} from "../src";

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

@Model(PERSON_MODEL_NAME, 1)
class Person1 extends StateAggregateBase<Person1Props> {
  @Prop()
  declare name: string;

  @Prop()
  declare age: number;
}

interface Person2Props {
  name: string;
  age: number;
}

@Model(PERSON_MODEL_NAME, 2)
class Person2 extends StateAggregateBase<Person2Props> {
  @Prop()
  declare name: string;

  @Prop()
  declare age: number;
}

describe("Domain", function () {
  let modelRegistry = new ModelRegistry();

  it("Model registry", () => {
    modelRegistry.registerModel(Person);

    expect(modelRegistry.getModelVersionMap(PERSON_MODEL_NAME).size).to.equal(
      1
    );

    expect(modelRegistry.getModel(PERSON_MODEL_NAME, 0)).to.equal(Person);

    expect(() => modelRegistry.registerModel(Person)).to.throw();

    modelRegistry.registerModel(Person1);

    expect(modelRegistry.getModelVersionMap(PERSON_MODEL_NAME).size).to.equal(
      2
    );

    expect(modelRegistry.getModel(PERSON_MODEL_NAME, 1)).to.equal(Person1);

    expect(modelRegistry.getModel(PERSON_MODEL_NAME)).to.equal(Person);
  });

  it("Domain manager", () => {
    const defaultDomain = domainManager.getDomain();

    expect(defaultDomain).not.be.undefined;

    expect(
      defaultDomain.modelRegistry.getModelVersionMap(PERSON_MODEL_NAME).size
    ).to.equal(3);

    expect(defaultDomain.modelRegistry.getModel(PERSON_MODEL_NAME, 2)).to.equal(
      Person2
    );

    const testDomain = domainManager.getDomain("uncreated_domain");

    expect(testDomain).not.be.undefined;
  });
});
