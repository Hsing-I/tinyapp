const bcrypt = require('bcrypt');
const { users } = require('../db/data');

const emailExists = (users, id, email) => {
  for (users[id] in users) {
    console.log(users[id]);
    if (users[users[id]].email === email) {
      return true;
    }
  }
  return false;
}

const getUserByEmail = (users, email) => {
  let result = {};
  for (user in users) {
    if (users[user].email === email) {
      result = user;
    }
  }
  return result;
}

const passwordMatching = (users, email, password) => {
  const hashedPassword = users[user].password;
  for (user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, hashedPassword)) {
      return true;
    }
  }
  return false;
}

const fetchUser = (users, id) => {
  return users[id] ? users[id] : {};
}

const fetchId = (email, password) => {
  const hashedPassword = users[user].password;
  for (const user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, hashedPassword)) {
      return users[user].id;
    }
  }
  return 0;
}

const urlsForUser = (urlDatabase, id) => {
  const results = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      results[url] = urlDatabase[url];
    }
  }
  return results;
}


module.exports = { emailExists, fetchUser, getUserByEmail, passwordMatching, fetchId, urlsForUser };