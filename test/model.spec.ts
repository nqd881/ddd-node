/// <reference path="./declaration/index.d.ts" />

import * as chai from "chai";
import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import chaiDeepMatch from "chai-deep-match";
import {
  ModelBase,
  ModelName,
  Prop,
  PropsValidator,
  Validator,
  ValueObjectBase,
} from "../src";

chai.use(chaiDeepMatch);

interface NameProps {
  firstName: string;
  lastName: string;
}

export class Name extends ValueObjectBase<NameProps> {
  @Prop()
  declare firstName: string;

  @Prop()
  declare lastName: string;

  constructor(firstName: string, lastName: string = "") {
    super({ firstName, lastName });
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
interface PersonProps {
  name: Name;
  age?: number;
}

class InvalidPersonAgeError extends Error {
  constructor() {
    super("Invalid person age");
  }
}

const PersonValidator: PropsValidator<Person> = (props) => {
  if (props?.age && (props.age < 0 || props.age > 200))
    throw new InvalidPersonAgeError();
};

@Validator(PersonValidator)
class Person<P extends PersonProps = PersonProps> extends ModelBase<P> {
  @Prop()
  declare name: Name;

  @Prop("name")
  declare nameAlias: Name;

  @Prop()
  declare age?: number;

  @Prop()
  declare unknownProp: string;

  get uppercaseName() {
    return this.name.fullName.toUpperCase();
  }

  // public method initializeProps
  initializeProps = super.initializeProps;

  changeName(name: Name) {
    this._props.name = name;
  }
}

const STUDENT_MODEL_NAME = "student";

class InvalidStudentSchoolError extends Error {
  constructor(invalidSchool: string) {
    super(`Invalid school. School must not be ${invalidSchool}`);
  }
}

interface StudentProps extends PersonProps {
  school: string;
}

const StudentValidator: PropsValidator<Student> = (props) => {
  if (Student.isInvalidSchool(props.school))
    throw new InvalidStudentSchoolError(props.school);
};

@ModelName(STUDENT_MODEL_NAME)
@Validator(StudentValidator)
class Student extends Person<StudentProps> {
  static readonly INVALID_SCHOOLS = ["HUST", "UEL"];

  static isInvalidSchool(school: string) {
    return this.INVALID_SCHOOLS.includes(school);
  }

  static override mutable() {
    return true;
  }

  @Prop()
  declare school: string;

  constructor(props: StudentProps) {
    super();

    this.initializeProps(props);
  }

  changeSchool(school: string) {
    this._props.school = school;
  }
}

describe("Model", function () {
  describe("Model name", function () {
    it("using default model name", () => {
      expect(Person.modelName()).to.equals(Person.name);
    });

    it("using decorated model name", () => {
      expect(Student.modelName()).to.equal(STUDENT_MODEL_NAME);
    });
  });

  describe("Props map", function () {
    it("get own props map", () => {
      const expectOwnPropsMap = { school: "school" };

      const ownPropsMap = Object.fromEntries(Student.ownPropsMap());

      expect(ownPropsMap).to.deep.match(expectOwnPropsMap);
    });

    it("get props map", () => {
      const expectPropsMap = {
        name: "name",
        nameAlias: "name",
        school: "school",
      };

      const propsMap = Object.fromEntries(Student.propsMap());

      expect(propsMap).to.deep.match(expectPropsMap);
    });
  });

  describe("Create model instance", function () {
    let person: Person;

    beforeEach(() => {
      person = new Person();
    });

    it("without initialized props", () => {
      const personProps = person.props();

      expect(personProps).to.be.null;
    });

    it("with initialized props", () => {
      const props = { name: new Name("Dai") };

      person.initializeProps(props);

      const personProps = person.props();

      expect(personProps).to.deep.match(props);
    });
  });

  describe("Getter", function () {
    const name = new Name("Dai");
    const person = new Person();
    person.initializeProps({ name });

    it("getter has same name with prop", () => {
      // expect(person.name).to.equal(name);
      expect(person.name.equals(name)).to.be.true;
    });

    it("getter with another name with prop", () => {
      // expect(person.nameAlias).to.equal(name);
      expect(person.nameAlias.equals(name)).to.be.true;
    });

    it("getter with unknown prop target", () => {
      expect(person.unknownProp).to.be.undefined;
    });

    it("manual getter", () => {
      expect(person.uppercaseName).to.equal(name.fullName.toUpperCase());
    });
  });

  describe("prop()", function () {
    it("getter working", () => {
      const student = new Student({
        name: new Name("Dai"),
        school: "NEU",
      });

      const props = student.props()!;

      expect(props.name.firstName).to.equal("Dai");
      expect(props.school).to.equal("NEU");
    });
  });

  describe("Update", function () {
    it("on immutable model", () => {
      const person = new Person();
      const name = new Name("Dai");
      const newName = new Name("Vu");

      person.initializeProps({
        name,
      });

      const updateName = () => person.changeName(newName);

      expect(updateName).to.throw;

      expect(person.name.firstName).to.equal(name.firstName);
    });

    it("on mutable model", () => {
      const school = "NEU";
      const newSchool = "UET";

      const student = new Student({
        name: new Name("Dai"),
        school,
      });

      const updateSchool = () => student.changeSchool(newSchool);

      expect(updateSchool).to.not.throw;

      updateSchool();

      expect(student.school).to.equal(newSchool);
    });
  });

  describe("Validator", function () {
    const invalidStudent = () =>
      new Student({ name: new Name("Huy"), school: "HUST" });
    const validStudent = () =>
      new Student({ name: new Name("Dai"), school: "NEU" });

    it("validator set", () => {
      expect(Student.ownPropsValidator()).to.equal(StudentValidator);
    });

    it("validate after initialize props", () => {
      expect(invalidStudent).to.throw(InvalidStudentSchoolError);
    });

    it("validate on update props", () => {
      const student = validStudent();

      const updateToInvalidSchool = () => student.changeSchool("HUST");

      expect(updateToInvalidSchool).to.throw(InvalidStudentSchoolError);
    });

    it("validator chain", () => {
      const student = () =>
        new Student({ name: new Name("Dai"), age: 201, school: "NEU" });

      expect(Person.propsValidators().length).to.equal(1);
      expect(Student.propsValidators().length).to.equal(2);

      expect(student).to.throw(InvalidPersonAgeError);
    });
  });
});
