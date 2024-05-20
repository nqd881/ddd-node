/// <reference path="./declaration/index.d.ts" />

import * as chai from "chai";
import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import chaiDeepMatch from "chai-deep-match";
import { ModelBase, ModelName, Prop, PropsValidator, Validator } from "../src";

chai.use(chaiDeepMatch);

interface PersonProps {
  name: string;
}

class Person<P extends PersonProps = PersonProps> extends ModelBase<P> {
  @Prop()
  name: string;

  @Prop("name")
  nameAlias: string;

  @Prop()
  unknownProp: string;

  get uppercaseName() {
    return this.name.toUpperCase();
  }

  // public method initializeProps
  initializeProps = super.initializeProps;

  changeName(name: string) {
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
  school: string;

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
      const props = { name: "Dai" };

      person.initializeProps(props);

      const personProps = person.props();

      expect(personProps).to.deep.match(props);
    });
  });

  describe("Getter", function () {
    const name = "Dai";
    const person = new Person();
    person.initializeProps({ name });

    it("getter has same name with prop", () => {
      expect(person.name).to.equal(name);
    });

    it("getter with another name with prop", () => {
      expect(person.nameAlias).to.equal(name);
    });

    it("getter with unknown prop target", () => {
      expect(person.unknownProp).to.be.undefined;
    });

    it("manual getter", () => {
      expect(person.uppercaseName).to.equal(name.toUpperCase());
    });
  });

  describe("Update", function () {
    it("on immutable model", () => {
      const person = new Person();
      const name = "Dai";
      const newName = "Vu";

      person.initializeProps({
        name,
      });

      const updateName = () => person.changeName(newName);

      expect(updateName).to.throw;

      expect(person.name).to.equal(name);
    });

    it("on mutable model", () => {
      const school = "NEU";
      const newSchool = "UET";

      const student = new Student({
        name: "Dai",
        school,
      });

      const updateSchool = () => student.changeSchool(newSchool);

      expect(updateSchool).to.not.throw;

      updateSchool();

      expect(student.school).to.equal(newSchool);
    });
  });

  describe("Validator", function () {
    const invalidStudent = () => new Student({ name: "Huy", school: "HUST" });
    const validStudent = () => new Student({ name: "Dai", school: "NEU" });

    it("validator set", () => {
      expect(Student.propsValidator()).to.equal(StudentValidator);
    });

    it("validate after initialize props", () => {
      expect(invalidStudent).to.throw(InvalidStudentSchoolError);
    });

    it("validate on update props", () => {
      const student = validStudent();

      const updateToInvalidSchool = () => student.changeSchool("HUST");

      expect(updateToInvalidSchool).to.throw(InvalidStudentSchoolError);
    });
  });
});
