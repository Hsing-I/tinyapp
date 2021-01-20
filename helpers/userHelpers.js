const { urlDatabase, users } = require('../db/data');

const emailExists = (users, id, email) => {
  for(users[id] in users){
    console.log(users[id]);
    if(users[users[id]].email === email){
      return true;
    }
  }
  return false;
}

const verifyEmail = (users, email) => {
  for(user in users){
    if(users[user].email === email){
      return true;
    }
  }
  return false;
}

const passwordMatching = (users, email, password) =>{
  for(user in users){
    if(users[user].email === email && users[user].password === password){
      return true;
    }
  }
  return false;
}

const fetchUser = (users, id) => {
  return users[id] ? users[id] : {};
}

const fetchId = (user, email, password) => {
  for(const user in users){
    if(users[user].email === email && users[user].password === password){
      return users[user].id;
    }
  }
  return 0;
}


module.exports= { emailExists, fetchUser, passwordMatching, verifyEmail, fetchId };