import { expect } from "chai";
import { describe } from "mocha";
import { Event, EventBase, Prop, StateAggregateBase } from "../src";

interface PersonNameChangedEventProps {
  oldName: string;
  newName: string;
}

@Event("PERSON_NAME_CHANGED")
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
      const person = Person.builder().withProps({ name: "Dai" }).build();

      expect(person.name).to.equal("Dai");
    });
  });

  describe("Instance method", function () {
    it("record an event and then clear all", () => {
      const person = Person.builder().withProps({ name: "Dai" }).build();

      person.changeName("Nam");

      expect(person.events()).to.be.not.empty;
      expect(person.events()[0]).instanceOf(PersonNameChangedEvent);

      person.clearEvents();

      expect(person.events()).to.be.empty;
    });
  });
});
