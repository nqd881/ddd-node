import { expect } from "chai";
import { describe } from "mocha";
import {
  Command,
  CommandBase,
  Event,
  EventBase,
  EventSourcedAggregateBase,
  Handle,
  Prop,
  When,
} from "../src";

interface PersonCreatedEventProps {
  name: string;
}

@Event("PERSON_CREATED")
class PersonCreatedEvent extends EventBase<PersonCreatedEventProps> {}

interface ChangeNameCommandProps {
  name: string;
}

@Command("CHANGE_PERSON_NAME")
class ChangePersonNameCommand extends CommandBase<ChangeNameCommandProps> {}

interface PersonNameChangedEventProps {
  name: string;
}

class PersonNameChangedEvent extends EventBase<PersonNameChangedEventProps> {}

interface PersonProps {
  name: string;
}

class InvalidPersonNameError extends Error {
  constructor() {
    super("Invalid person name");
  }
}

class Person extends EventSourcedAggregateBase<PersonProps> {
  static createPerson(props: PersonProps) {
    const person = Person.newStream();

    person.applyNewEvent(PersonCreatedEvent, { name: props.name });

    return person;
  }

  @Prop()
  declare name: string;

  @When(PersonCreatedEvent)
  whenPersonCreated(event: PersonCreatedEvent) {
    const { name } = event.props();

    this.initializeProps({ name });
  }

  @Handle(ChangePersonNameCommand)
  handleChangeName(command: ChangePersonNameCommand) {
    const { name } = command.props();

    const isNameStartWithUnderscore = name.at(0) === "_";

    if (isNameStartWithUnderscore) throw new InvalidPersonNameError();

    return this.newEvent(PersonNameChangedEvent, { name });
  }

  @When(PersonNameChangedEvent)
  whenPersonNameChanged(event: PersonNameChangedEvent) {
    const { name } = event.props();

    this._props.name = name;
  }
}

describe("Event sourced aggregate", function () {
  describe("Static methods", function () {
    it("create instance with newStream", () => {
      const person = Person.newStream();

      expect(person.props()).to.be.null;
    });

    it("create instance with fromStream", () => {
      const personA = Person.createPerson({ name: "Dai" });

      personA.handleCommand(
        ChangePersonNameCommand.newCommand({ name: "Duong" })
      );

      const pastEvents = personA.events();

      personA.handleCommand(ChangePersonNameCommand.newCommand({ name: "Vu" }));

      const personB = Person.fromStream(personA.id(), pastEvents);

      expect(personB.name).to.equal("Duong");
      expect(personB.version()).to.equal(2);
    });

    it("create instance with fromSnapshot", () => {
      const personA = Person.createPerson({ name: "Dai" });

      personA.handleCommand(
        ChangePersonNameCommand.newCommand({ name: "Duong" })
      );

      const snapshot = personA.snap();

      const events = personA.handleCommand(
        ChangePersonNameCommand.newCommand({ name: "Vu" })
      );

      const personB = Person.fromSnapshot(snapshot);

      expect(personB.name).to.equal("Duong");
      expect(personB.pastEvents().length).to.equal(0);
      expect(personB.version()).to.equal(2);

      const personC = Person.fromSnapshot(snapshot, events);

      expect(personC.name).to.equal("Vu");
      expect(personC.pastEvents().length).to.equal(1);
      expect(personC.version()).to.equal(3);
    });
  });

  describe("Handle command", function () {
    it("create new person", () => {
      const person = Person.createPerson({ name: "Dai" });

      expect(person.name).to.equal("Dai");
    });

    it("change person name", () => {
      const person = Person.createPerson({ name: "Dai" });

      person.handleCommand(
        ChangePersonNameCommand.newCommand({ name: "Duong" })
      );

      expect(person.name).to.equal("Duong");
    });
  });
});
