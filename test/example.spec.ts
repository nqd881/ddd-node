import { expect } from "chai";
import { beforeEach, describe } from "mocha";
import {
  EntityBase,
  Id,
  Model,
  Prop,
  StateAggregateBase,
  ValueObjectBase,
} from "../src";

interface NameProps {
  firstName: string;
  lastName: string;
}

export class Name extends ValueObjectBase<NameProps> {
  @Prop()
  declare firstName: string;

  @Prop()
  declare lastName: string;

  constructor(firstName: string, lastName: string) {
    super({ firstName, lastName });
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
interface BatteryLevelProps {
  percentage: number;
}

@Model({
  propsValidator: (props) => {
    if (props.percentage < 0)
      throw new Error("Battery percentage cannot lower than 0");
    if (props.percentage > 100)
      throw new Error("Battery percentage cannot greater than 100");
  },
})
class BatteryLevel extends ValueObjectBase<BatteryLevelProps> {
  @Prop()
  declare percentage: number;

  constructor(value: number) {
    super({ percentage: value });
  }
}

interface PhoneProps {
  brand: string;
  batteryLevel: BatteryLevel;
}

class Phone extends EntityBase<PhoneProps> {
  @Prop()
  declare brand: string;

  @Prop()
  declare batteryLevel: BatteryLevel;

  chargeTo(batteryLevel: BatteryLevel) {
    if (this.batteryLevel.percentage >= batteryLevel.percentage) return;

    this._props.batteryLevel = batteryLevel;
  }
}

interface PersonProps {
  name: Name;
  phones: Phone[];
}

class Person extends StateAggregateBase<PersonProps> {
  @Prop()
  declare name: Name;

  @Prop()
  declare phones: Phone[];

  getPhone(id: Id) {
    return this._props.phones.find((phone) => phone.hasId(id));
  }

  chargePhoneTo(phoneId: Id, toLevel: BatteryLevel) {
    const phone = this.getPhone(phoneId);

    if (!phone) throw new Error("Phone not found");

    phone.chargeTo(toLevel);
  }
}

describe("Example", function () {
  let person: Person;
  let applePhone: Phone, samsungPhone: Phone;

  beforeEach(() => {
    applePhone = Phone.builder()
      .withProps({
        brand: "Apple",
        batteryLevel: new BatteryLevel(50),
      })
      .build();

    samsungPhone = Phone.builder()
      .withProps({
        brand: "Samsung",
        batteryLevel: new BatteryLevel(75),
      })
      .build();

    person = Person.builder()
      .withProps({
        name: new Name("Dai", "Nguyen Quoc"),
        phones: [applePhone, samsungPhone],
      })
      .build();
  });

  it("expect deep getter working", () => {
    expect(person.phones[0].batteryLevel.percentage).to.equal(50);
    expect(person.phones[1].batteryLevel.percentage).to.equal(75);
  });

  it("expect props's getter working", () => {
    const personProps = person.props();

    expect(personProps.phones[0].batteryLevel.percentage).to.equal(50);
    expect(personProps.phones[1].batteryLevel.percentage).to.equal(75);
  });

  it("expect update working", () => {
    person.chargePhoneTo(applePhone.id(), new BatteryLevel(63));

    expect(person.phones[0].batteryLevel.percentage).to.equal(63);
    expect(applePhone.batteryLevel.percentage).to.equal(63);
  });

  it("person correct", () => {
    expect(person.name).instanceof(Name);
    expect(person.name.firstName).equal("Dai");
  });
});
