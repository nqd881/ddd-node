import { expect } from "chai";
import { describe } from "mocha";
import { EntityBase, EntityBuilder, Prop } from "../src";

interface UserProps {
  name: string;
}

class User extends EntityBase<UserProps> {
  @Prop()
  declare name: string;
}

describe("Entity", function () {
  const UserBuilder = () => new EntityBuilder(User);

  describe("Static methods", function () {
    it("newEntity", () => {
      const user = UserBuilder().withProps({ name: "Dai" }).build();

      expect(user.name).to.equal("Dai");
    });
  });
});
