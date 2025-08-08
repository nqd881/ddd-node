import { expect } from "chai";
import { describe } from "mocha";
import { IsEvent, Event, Prop, StateAggregate } from "../src";

interface PersonNameChangedEventProps {
  oldName: string;
  newName: string;
}

@IsEvent("PERSON_NAME_CHANGED")
class PersonNameChangedEvent extends Event<PersonNameChangedEventProps> {}

interface PersonProps {
  name: string;
}

class Person extends StateAggregate<PersonProps> {
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
      const person = Person.build({ name: "Dai" });

      expect(person.name).to.equal("Dai");
    });
  });

  describe("Instance method", function () {
    it("record an event and then clear all", () => {
      const person = Person.build({ name: "Dai" });

      person.changeName("Nam");

      expect(person.events()).to.be.not.empty;
      expect(person.events()[0]).instanceOf(PersonNameChangedEvent);

      person.clearEvents();

      expect(person.events()).to.be.empty;
    });
  });
});
