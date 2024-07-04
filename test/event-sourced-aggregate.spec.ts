import { expect } from "chai";
import { describe } from "mocha";
import {
  Command,
  CommandBase,
  CommandBuilder,
  Event,
  EventBase,
  EventSourcedAggregateBase,
  EventSourcedAggregateBuilder,
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

@Event("PERSON_NAME_CHANGED")
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
    const builder = new EventSourcedAggregateBuilder(Person);

    const person = builder.build();

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

// The ExtendablePerson will almost like Person, but it must not to call initializeProps
class ExtendablePerson<
  P extends PersonProps
> extends EventSourcedAggregateBase<P> {
  @Prop()
  declare name: string;

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

interface StudentCreatedEventProps {
  name: string;
  school: string;
}

@Event("STUDENT_CREATED")
class StudentCreatedEvent extends EventBase<StudentCreatedEventProps> {}

interface StudentProps extends PersonProps {
  school: string;
}

interface ChangeStudentSchoolCommandProps {
  school: string;
}

@Command("CHANGE_STUDENT_SCHOOL")
class ChangeStudentSchoolCommand extends CommandBase<ChangeStudentSchoolCommandProps> {}

interface StudentSchoolChangedEventProps {
  school: string;
}

@Event("STUDENT_SCHOOL_CHANGED")
class StudentSchoolChangedEvent extends EventBase<StudentSchoolChangedEventProps> {}

class Student extends ExtendablePerson<StudentProps> {
  static createStudent(props: StudentProps) {
    const builder = new EventSourcedAggregateBuilder(Student);

    const student = builder.build();

    student.applyNewEvent(StudentCreatedEvent, {
      name: props.name,
      school: props.school,
    });

    return student;
  }

  @Prop()
  declare school: string;

  @When(StudentCreatedEvent)
  whenStudentCreated(event: StudentCreatedEvent) {
    const { name, school } = event.props();

    this.initializeProps({ name, school });
  }

  @Handle(ChangeStudentSchoolCommand)
  handleChangeStudentSchool(command: ChangeStudentSchoolCommand) {
    const { school } = command.props();

    return this.newEvent(StudentSchoolChangedEvent, { school });
  }

  @When(StudentSchoolChangedEvent)
  whenSchoolChanged(event: StudentSchoolChangedEvent) {
    const { school } = event.props();

    this._props.school = school;
  }
}

describe("Event sourced aggregate", function () {
  const PersonBuilder = () => new EventSourcedAggregateBuilder(Person);

  describe("Building", function () {
    it("create instance with new stream", () => {
      const person = PersonBuilder().build();

      expect(person.props()).to.be.null;
    });

    it("create instance with existing stream", () => {
      const personA = Person.createPerson({ name: "Dai" });

      personA.handleCommand(
        new CommandBuilder(ChangePersonNameCommand)
          .withProps({ name: "Duong" })
          .build()
      );

      const pastEvents = personA.events();

      personA.handleCommand(
        new CommandBuilder(ChangePersonNameCommand)
          .withProps({ name: "Vu" })
          .build()
      );

      const personB = PersonBuilder()
        .withId(personA.id())
        .withPastEvents(pastEvents)
        .build();

      expect(personB.name).to.equal("Duong");
      expect(personB.version()).to.equal(2);
    });

    it("create instance with snapshot", () => {
      const personA = Person.createPerson({ name: "Dai" });

      personA.handleCommand(
        new CommandBuilder(ChangePersonNameCommand)
          .withProps({ name: "Duong" })
          .build()
      );

      const snapshot = personA.snap();

      const eventsAfterSnapshot = personA.handleCommand(
        new CommandBuilder(ChangePersonNameCommand)
          .withProps({ name: "Vu" })
          .build()
      );

      const personB = PersonBuilder().withSnapshot(snapshot).build();

      expect(personB.name).to.equal("Duong");
      expect(personB.pastEvents().length).to.equal(0);
      expect(personB.version()).to.equal(2);

      const personC = PersonBuilder()
        .withSnapshot(snapshot)
        .withPastEvents(eventsAfterSnapshot)
        .build();

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
        new CommandBuilder(ChangePersonNameCommand)
          .withProps({ name: "Duong" })
          .build()
      );

      expect(person.name).to.equal("Duong");
    });
  });

  describe("Extendable aggregate", function () {
    it("command handler map", () => {
      expect(ExtendablePerson.commandHandlerMap().size).to.equal(1);
      expect(Student.commandHandlerMap().size).to.equal(2);
    });

    it("event applier map", () => {
      expect(ExtendablePerson.eventApplierMap().size).to.equal(1);
      expect(Student.eventApplierMap().size).to.equal(3);
    });

    it("handle super command", () => {
      const student = Student.createStudent({ name: "Dai", school: "NEU" });

      const changeStudentName = () =>
        student.handleCommand(
          new CommandBuilder(ChangePersonNameCommand)
            .withProps({ name: "Duong" })
            .build()
        );

      expect(changeStudentName).not.throw();

      changeStudentName();

      expect(student.name).to.equals("Duong");
    });
  });
});
