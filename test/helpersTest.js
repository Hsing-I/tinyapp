const { assert } = require('chai');
const { getUserByEmail } = require('../helpers/userHelpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
});

describe('getUserByEmail', function () {
  it('should return empty object with email not in db', function () {
    const user = getUserByEmail(testUsers, "test@example.com");
    const expectedOutput = 0;
    assert.equal(Object.keys(user).length, expectedOutput);
  });
});