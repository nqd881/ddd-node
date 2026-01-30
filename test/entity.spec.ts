import { expect } from "chai";
import { describe } from "mocha";
import { Entity, Prop } from "../src";

interface UserProps {
  name: string;
}

class User extends Entity<UserProps> {
  @Prop()
  declare name: string;
}

describe("Entity", function () {
  describe("Static methods", function () {
    it("newEntity", () => {
      const user = User.new({ name: "Dai" });

      expect(user.name).to.equal("Dai");
    });
  });
});
