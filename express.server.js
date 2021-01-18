const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json());


app.get("/", (req, res) => {
  //res.render('pages/index');
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.status(200).redirect(`/urls/${shortURL}`);
});

app.listen(PORT, ()=>{
  console.log(`Example app listening on PROT ${PORT}!`);
});

function generateRandomString() {
  return randomString = Math.random().toString(36).replace('0.', '').substring(0,6); 
}
