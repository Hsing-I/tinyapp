const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { urlDatabase, users } = require('./db/data');
const { emailExists, fetchUser, passwordMatching, getUserByEmail, fetchId, urlsForUser } = require('./helpers/userHelpers');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//GET endpoint
app.get("/", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  if (isLoggedIn) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  const user = fetchUser(users, req.session.user_id);
  const urls = urlsForUser(urlDatabase, user.id);
  const templateVars = { isLoggedIn, user, urls };
  res.render('urls_index', templateVars);
});

//logged in user allow
app.get("/urls/new", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  if (!isLoggedIn) {
    res.redirect("/login");
  } else {
    const user = fetchUser(users, req.session.user_id);
    const templateVars = { isLoggedIn, user };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  const user = fetchUser(users, req.session.user_id);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = { isLoggedIn, user, shortURL, longURL, urlDatabase };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    res.redirect(urlDatabase[shortURL].longURL);
  }
});

app.get("/register", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  const user = fetchUser(users, req.session.user_id);
  const message = "";
  const templateVars = { isLoggedIn, user, message };
  res.render("registration_form", templateVars);
});

app.get("/login", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  const user = fetchUser(users, req.session.user_id);
  const message = "";
  const templateVars = { isLoggedIn, user, message };
  res.render("login_form", templateVars);
});

//POST endpoint
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = fetchUser(users, req.session.user_id).id;
  const newURL = {
    longURL,
    userID
  }
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls/${shortURL}`);
});

//delete url, logged in user allow
app.post("/urls/:shortURL/delete", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  if (isLoggedIn) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

//edit url, logged in user allow
app.post("/urls/:shortURL", (req, res) => {
  const isLoggedIn = req.session.user_id ? true : false;
  if (isLoggedIn) {
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isLoggedIn = req.session.user_id ? true : false;

  if (!getUserByEmail(users, email)) {
    const message = `Email does not exists`;
    const templateVars = { isLoggedIn, message };
    res.status(403).render("login_form", templateVars);
  } else if (!passwordMatching(users, email, password)) {
    const message = `Wrong password`;
    const templateVars = { isLoggedIn, message };
    res.status(403).render("login_form", templateVars);
  } else {
    const id = fetchId(email, password);
    req.session['user_id'] = id;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect("/urls");
});


app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const isLoggedIn = req.session.user_id ? true : false;

  if (emailExists(users, id, email)) {
    const message = `Email already exists`;
    const templateVars = { isLoggedIn, message };
    res.status(400).render("registration_form", templateVars);
  } else {
    const newUser = {
      id,
      email,
      password: hashedPassword
    }
    users[id] = newUser;
    req.session['user_id'] = id;
    res.redirect("/urls");
  }

})

app.listen(PORT, () => {
  console.log(`Example app listening on PROT ${PORT}!`);
});

const generateRandomString = () => {
  return randomString = Math.random().toString(36).replace('0.', '').substring(0, 6);
}

