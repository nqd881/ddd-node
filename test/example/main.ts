import { random } from "lodash";
import {
  AggregateES,
  Command,
  Event,
  IdGenerator,
  aggregate,
  applyEvent,
  command,
  event,
  handleCommand,
  id,
} from "src";

export class Random10IdGenerator extends IdGenerator {
  generateValue() {
    return random(10).toString();
  }

  validateValue(value: string) {}
}

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

@id(new Random10IdGenerator())
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
  ChangeNameCommand.newCommand({ newName: "Tuan Anh" })
);

const snapshot = personA.snap();

console.log(snapshot);

const event2 = personA.handleCommand(
  ChangeNameCommand.newCommand({ newName: "Vu" })
);

console.log(personA, personA.getVersion());

const personB = Person.fromStream(personA.getId(), personA.getEvents());

console.log(personB, personB.getVersion());

const personC = Person.fromSnapshot(snapshot, event2);

console.log(personC, personC.getVersion());

personC.handleCommand(ChangeNameCommand.newCommand({ newName: "Huy" }));

console.log(personC, personC.getVersion());
