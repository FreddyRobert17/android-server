const fs = require("fs");
const { faker } = require("@faker-js/faker");

function createUser(body) {
  const user = {
    id: faker.datatype.uuid(),
    username: body.username,
    email: body.email,
    password: body.password,
  };

  const rawData = fs.readFileSync("./data/users.json");

  const data = JSON.parse(rawData);

  const users = [...data, user];

  const jsonString = JSON.stringify(users);

  fs.writeFileSync("./data/users.json", jsonString);

  return user;
}

function isAuthUser(userLogged) {
  const response = fs.readFileSync("./data/users.json");

  const users = JSON.parse(response);

  const authUser = users.find(
    (user) =>
      user.email === userLogged.email && user.password === userLogged.password
  );

  if (authUser) {
    return true;
  }
  
  return false;
}

function findUser(id){
  const response = fs.readFileSync("./data/users.json");

  const users = JSON.parse(response);

  console.log(users, 'users');

  const user = users.find(element => element.id == id)

  console.log(user, 'user');

  if(!user){
    throw new Error(`Couldn't find user with id: ${id}`)
  }

  return user
}

module.exports = { createUser, isAuthUser, findUser };
