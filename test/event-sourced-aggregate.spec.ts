import { expect } from "chai";
import { describe } from "mocha";
import {
  IsCommand,
  Command,
  IsEvent,
  Event,
  ESAggregate,
  Handle,
  Model,
  Prop,
  When,
} from "../src";
import { v4 } from "uuid";

const DOMAIN = "event-source-aggregate.test";

interface PersonCreatedEventProps {
  name: string;
}

@IsEvent("PERSON_CREATED", { domain: DOMAIN })
class PersonCreatedEvent extends Event<PersonCreatedEventProps> {}

interface ChangeNameCommandProps {
  name: string;
}

@IsCommand("CHANGE_PERSON_NAME", { domain: DOMAIN })
class ChangePersonNameCommand extends Command<ChangeNameCommandProps> {}

interface PersonNameChangedEventProps {
  name: string;
}

@IsEvent("PERSON_NAME_CHANGED", { domain: DOMAIN })
class PersonNameChangedEvent extends Event<PersonNameChangedEventProps> {}

interface PersonProps {
  name: string;
}

class InvalidPersonNameError extends Error {
  constructor() {
    super("Invalid person name");
  }
}

@Model({ domain: DOMAIN })
class Person extends ESAggregate<PersonProps> {
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

// The ExtendablePerson will almost like Person, but it must not to call initializeProps
@Model({ domain: DOMAIN })
class ExtendablePerson<P extends PersonProps> extends ESAggregate<P> {
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

@IsEvent("STUDENT_CREATED", { domain: DOMAIN })
class StudentCreatedEvent extends Event<StudentCreatedEventProps> {}

interface StudentProps extends PersonProps {
  school: string;
}

interface ChangeStudentSchoolCommandProps {
  school: string;
}

@IsCommand("CHANGE_STUDENT_SCHOOL", { domain: DOMAIN })
class ChangeStudentSchoolCommand extends Command<ChangeStudentSchoolCommandProps> {}

interface StudentSchoolChangedEventProps {
  school: string;
}

@IsEvent("STUDENT_SCHOOL_CHANGED", { domain: DOMAIN })
class StudentSchoolChangedEvent extends Event<StudentSchoolChangedEventProps> {}

@Model({ domain: DOMAIN })
class Student extends ExtendablePerson<StudentProps> {
  static createStudent(props: StudentProps) {
    const student = Student.newStream();

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

describe("EventSourcedAggregate", function () {
  describe("Building", function () {
    it("create instance with newStream()", () => {
      const person = Person.newStream();

      expect(person.props()).to.be.null;
    });

    it("create instance with existing stream", () => {
      const personA = Person.createPerson({ name: "Dai" });

      const requestId = v4();

      const command1 = ChangePersonNameCommand.new(
        { name: "Duong" },
        {
          correlationIds: {
            requestId,
          },
        }
      );

      const [event1] = personA.handleCommand(command1);

      expect(event1.correlationIds.requestId).to.equals(requestId);
      expect(event1.causationId).to.equals(command1.id);

      const pastEvents = personA.events();

      personA.handleCommand(ChangePersonNameCommand.new({ name: "Vu" }));

      const personB = Person.fromStream(personA.id, pastEvents);

      expect(personB.name).to.equal("Duong");
      expect(personB.version).to.equal(2);
    });

    it("create instance with fromSnapshot()", () => {
      const personA = Person.createPerson({ name: "Dai" });

      personA.handleCommand(ChangePersonNameCommand.new({ name: "Duong" }));

      const snapshot = personA.takeSnapshot();

      const eventsAfterSnapshot = personA.handleCommand(
        ChangePersonNameCommand.new({ name: "Vu" })
      );

      const personB = Person.fromSnapshot(snapshot);

      expect(personB.name).to.equal("Duong");
      expect(personB.pastEvents().length).to.equal(0);
      expect(personB.version).to.equal(2);

      const personC = Person.fromSnapshot(snapshot, eventsAfterSnapshot);

      expect(personC.name).to.equal("Vu");
      expect(personC.pastEvents().length).to.equal(1);
      expect(personC.version).to.equal(3);
    });
  });

  describe("Handle command", function () {
    it("create new person", () => {
      const person = Person.createPerson({ name: "Dai" });

      expect(person.name).to.equal("Dai");
    });

    it("change person name", () => {
      const person = Person.createPerson({ name: "Dai" });

      person.handleCommand(ChangePersonNameCommand.new({ name: "Duong" }));

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
        student.handleCommand(ChangePersonNameCommand.new({ name: "Duong" }));

      expect(changeStudentName).not.throw();

      changeStudentName();

      expect(student.name).to.equals("Duong");
    });
  });
});
