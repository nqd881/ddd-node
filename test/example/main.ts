import { AggregateES } from "#core/aggregate";
import { Command } from "#core/command";
import { Event } from "#core/event";
import { Id, Uuid4 } from "#core/id";
import { aggregate, applyEvent, handleCommand } from "src/decorators/aggregate";
import { command } from "src/decorators/command";
import { event } from "src/decorators/event";

interface PersonCreatedEventProps {
  name: string;
}

@event()
class PersonCreatedEvent extends Event<PersonCreatedEventProps> {}

interface PersonNameChangedEventProps {
  name: string;
}

@event("PersonNameChanged")
class PersonNameChangedEvent extends Event<PersonNameChangedEventProps> {}
interface PersonProps {
  name: string;
}

interface ChangeNameCommandProps {
  newName: string;
}

@command()
class ChangeNameCommand extends Command<ChangeNameCommandProps> {}

@aggregate()
class Person extends AggregateES<PersonProps> {
  static create(props: PersonProps) {
    const newPerson = this.newStream();

    newPerson.applyEvent(newPerson.newEvent(PersonCreatedEvent, props));

    return newPerson;
  }

  get name() {
    return this._props.name;
  }

  @handleCommand(ChangeNameCommand)
  changeName(command: ChangeNameCommand) {
    const { newName } = command.props();

    return this.newEvent(PersonNameChangedEvent, { name: newName });
  }

  @applyEvent(PersonCreatedEvent)
  applyPersonCreated(event: PersonCreatedEvent) {
    const { name } = event.props();

    this.initializeProps({ name });
  }

  @applyEvent(PersonNameChangedEvent)
  applyNameChanged(event: PersonNameChangedEvent) {
    const { name } = event.props();

    this._props.name = name;
  }
}

const personA = Person.create({ name: "Dai" });

console.log(personA);

const event1 = personA.handleCommand(
  ChangeNameCommand.newCommand(
    { newName: "Tuan Anh" },
    { correlationId: Uuid4.new().value }
  )
);

const snapshot = personA.snap();

console.log(snapshot);

const event2 = personA.handleCommand(
  ChangeNameCommand.newCommand({ newName: "Vu" })
);

console.log(personA);

const personB = Person.fromStream(personA.id, personA.events);

console.log(personB);

const personC = Person.fromSnapshot(snapshot, event2);

console.log(personC);
