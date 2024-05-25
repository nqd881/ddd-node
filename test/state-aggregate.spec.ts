import { describe } from "mocha";
import { StateAggregateBase, EventBase, Prop } from "../src";
import { expect } from "chai";

interface PersonNameChangedEventProps {
  oldName: string;
  newName: string;
}

class PersonNameChangedEvent extends EventBase<PersonNameChangedEventProps> {}

interface PersonProps {
  name: string;
}

class Person extends StateAggregateBase<PersonProps> {
  @Prop()
  declare name: string;

  changeName(name: string) {
    const oldName = this.name;

    this._props.name = name;

    this.recordEvent(PersonNameChangedEvent, { oldName, newName: name });
  }
}

describe("State aggregate", function () {
  describe("Static methods", function () {
    it("create new instance using newAggregate", () => {
      const person = Person.newAggregate({ name: "Dai" });

      expect(person.name).to.equal("Dai");
    });
  });

  describe("Instance method", function () {
    it("record an event and then clear all", () => {
      const person = Person.newAggregate({ name: "Dai" });

      person.changeName("Nam");

      expect(person.getEvents()).to.be.not.empty;
      expect(person.getEvents()[0]).instanceOf(PersonNameChangedEvent);

      person.clearEvents();

      expect(person.getEvents()).to.be.empty;
    });
  });
});
