import { Credentials, Name, User } from ".";

const nameA = new Name({
  firstName: "Quoc",
  lastName: "Dai",
});

const userA = User.newAggregate({
  name: nameA,
  credentials: Credentials.newEntity({
    username: "quocdaitinls",
    password: "123123",
  }),
});

console.log(userA);

userA.changePassword("123123", "456456");

console.log(userA);
console.log(userA.credentials);

userA.changeName(nameA.with({ lastName: "Huy" }));

console.log(userA);
console.log(userA.getEvents());
