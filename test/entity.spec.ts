import { expect } from "chai";
import { describe } from "mocha";
import { EntityBase, Prop } from "../src";

interface UserProps {
  name: string;
}

class User extends EntityBase<UserProps> {
  @Prop()
  declare name: string;
}

describe("Entity", function () {
  describe("Static methods", function () {
    it("newEntity", () => {
      const user = User.builder()
        .withNewId()
        .withProps({ name: "Dai" })
        .build();

      expect(user.name).to.equal("Dai");
    });
  });
});
