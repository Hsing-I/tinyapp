const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { urlDatabase, users } = require('./db/data');
const { emailExists, fetchUser, passwordMatching, verifyEmail, fetchId } = require('./helpers/userHelpers');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

//GET endpoint
app.get("/urls", (req, res) => {
  const isLoggedIn  = req.cookies.user_id ? true : false;
  const user = fetchUser(users, req.cookies.user_id);
  const templateVars = { isLoggedIn, user, urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const isLoggedIn  = req.cookies.user_id ? true : false;
  const user = fetchUser(users, req.cookies.user_id);
  const templateVars = { isLoggedIn, user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const isLoggedIn  = req.cookies.user_id ? true : false;
  const user = fetchUser(users, req.cookies.user_id);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { isLoggedIn, user, shortURL, longURL };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/register", (req, res) => {
  const isLoggedIn  = req.cookies.user_id ? true : false;
  const user = fetchUser(users, req.cookies.user_id);
  const templateVars = { isLoggedIn, user };
  res.render("registration_form", templateVars);
});

app.get("/login", (req, res) => {
  const isLoggedIn  = req.cookies.user_id ? true : false;
  const user = fetchUser(users, req.cookies.user_id);
  const templateVars = { isLoggedIn, user };
  res.render("login_form", templateVars);
});

//POST endpoint
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    console.log("please fill out the form");
    res.statusCode = 400;
    res.redirect("/login");
  }else if (!verifyEmail(users, email)) {
    console.log("email does not exists");
    res.statusCode = 400;
    res.redirect("/login");
  }else if (!passwordMatching(users, email, password)){
    console.log("wrong password");
    res.statusCode = 400;
    res.redirect("/login");
  }else{
    const id = fetchId(users, email, password);
    console.log(id);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls"); 
});


app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    console.log("please fill out the form");
    res.statusCode = 400;
    res.redirect("/register");
  }else if (emailExists(users, id, email)) {
    console.log("email already exists");
    res.statusCode = 400;
    res.redirect("/register");
  } else {
    const newUser = {
      id,
      email,
      password
    }
    users[id] = newUser;
    console.log(users);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }

})

app.listen(PORT, () => {
  console.log(`Example app listening on PROT ${PORT}!`);
});

const generateRandomString = () => {
  return randomString = Math.random().toString(36).replace('0.', '').substring(0, 6);
}

//netstat -anp | grep 8080
//kill -9 pid