import { expect } from "chai";
import { beforeEach, describe } from "mocha";
import {
  EntityBase,
  Id,
  Prop,
  StateAggregateBase,
  Validator,
  ValueObjectBase,
} from "../src";

interface BatteryLevelProps {
  percentage: number;
}

@Validator((props) => {
  if (props.percentage < 0)
    throw new Error("Battery percentage cannot lower than 0");
  if (props.percentage > 100)
    throw new Error("Battery percentage cannot greater than 100");
})
class BatteryLevel extends ValueObjectBase<BatteryLevelProps> {
  @Prop()
  percentage: number;

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
  brand: string;

  @Prop()
  batteryLevel: BatteryLevel;

  chargeTo(batteryLevel: BatteryLevel) {
    if (this.batteryLevel.percentage >= batteryLevel.percentage) return;

    this._props.batteryLevel = batteryLevel;
  }
}

interface PersonProps {
  phones: Phone[];
}

class Person extends StateAggregateBase<PersonProps> {
  @Prop()
  phones: Phone[];

  getPhone(id: Id) {
    return this._props.phones.find((phone) => phone.hasId(id));
  }

  chargePhoneTo(phoneId: Id, toLevel: BatteryLevel) {
    const phone = this.getPhone(phoneId);

    if (!phone) throw new Error("Phone not found");

    phone.chargeTo(toLevel);
  }
}

describe("Deep model", function () {
  let person: Person;
  let applePhone: Phone, samsungPhone: Phone;

  beforeEach(() => {
    (applePhone = Phone.newEntity({
      brand: "Apple",
      batteryLevel: new BatteryLevel(50),
    })),
      (samsungPhone = Phone.newEntity({
        brand: "Samsung",
        batteryLevel: new BatteryLevel(75),
      }));

    person = Person.newAggregate({
      phones: [applePhone, samsungPhone],
    });
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
});
