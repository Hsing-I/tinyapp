const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

//GET endpoint
app.get("/urls", (req, res) => {
  const username = req.cookies['username'];
  const templateVars = { urls: urlDatabase, username };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies['username'];
  const templateVars = { username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const username = req.cookies['username'];
  const templateVars = { shortURL, longURL, username };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//POST endpoint
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.status(200).redirect(`/urls/${shortURL}`);
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
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  console.log("in the function");
  res.clearCookie("username");
  //res.cookie("username", "");
  res.redirect("/urls");
});

app.listen(PORT, ()=>{
  console.log(`Example app listening on PROT ${PORT}!`);
});

const generateRandomString = () => {
  return randomString = Math.random().toString(36).replace('0.', '').substring(0,6); 
}
