import { expect } from "chai";
import { describe, it } from "mocha";
import { Prop, Props, PropsBuilder, ValueObjectBase } from "../src";

interface NicknameProps {
  value: string;
}

class Nickname extends ValueObjectBase<NicknameProps> {
  @Prop()
  declare value: string;
}

interface NameProps {
  firstName: string;
  lastName: string;
  nicknames: Nickname[];
}

class Name extends ValueObjectBase<NameProps> {
  @Prop()
  declare firstName: string;

  @Prop()
  declare lastName: string;

  @Prop()
  declare nicknames: Nickname[];

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

enum MessageContentType {
  Text = "text",
  Photo = "photo",
}

abstract class MessageContent<
  TType extends MessageContentType,
  TProps extends Props
> extends ValueObjectBase<TProps & { type: TType }> {
  constructor(props: TProps) {
    super();

    this.initializeProps({ ...props, type: this.type$() });
  }

  abstract type$(): TType;

  @Prop()
  declare type: TType;
}

interface MessageContentTextProps {
  text: string;
}

class MessageContentText extends MessageContent<
  MessageContentType.Text,
  MessageContentTextProps
> {
  type$(): MessageContentType.Text {
    return MessageContentType.Text;
  }

  @Prop()
  declare text: string;
}

describe("Value Object", function () {
  const firstName = "Dai";
  const lastName = "Nguyen Quoc";

  const createName = (nicknames: string[] = []) =>
    new Name({
      firstName,
      lastName,
      nicknames: nicknames.map((nickname) => new Nickname({ value: nickname })),
    });

  it("create new instance", () => {
    expect(createName).to.not.throw;
  });

  it("compare instances using equals()", () => {
    const nameA = createName();
    const nameB = createName();

    expect(nameA.equals(nameB)).to.be.true;

    const nameC = createName(["nickname1", "nickname2"]);
    const nameD = createName(["nickname2", "nickname1"]);
    const nameE = createName(["nickname1", "nickname3"]);

    expect(nameC.equals(nameD)).to.be.true;
    expect(nameC.equals(nameE)).to.be.false;
  });

  it("create new instance using with()", () => {
    const nameA = createName();
    const nameB = nameA.with({ firstName: "Cuong" });

    expect(nameA).to.not.equal(nameB);
    expect(nameB.firstName).to.equal("Cuong");
    expect(nameB.lastName).to.equal(nameA.lastName);
  });

  it("with props builder", () => {
    const contentText = new MessageContentText({ text: "abc" });

    expect(contentText.type).to.equal(MessageContentType.Text);
    expect(contentText.text).to.equal("abc");
  });
});
