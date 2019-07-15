// Import modules
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const auth = require('./auth.js');
const saltRounds = 10;
// Connect to DATABASE
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bilingualism',
  password: 'KoraY*123',
  port: 5432,
})

//Inıt App
const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/'));

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// Home route
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/feed", function (req, res) {
  res.render("feed");
});
app.get("/newQuestion", function (req, res) {
  res.render("newQuestion");
});
// Login POST
let testpassword = '';
app.post("/login", (req, res) => {
  console.log("LOGIN form submitted");
  bcrypt.compare(req.body.password, testpassword, function(err, res) {
    console.log(res);
});
  console.log(req.body.email);
  console.log(req.body.password);
})


// Register POST
app.post("/register", async (req, res) => {
  /*
  const { email, username, password, confpassword } = req.body;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const now = new Date();
    pool.query('INSERT INTO users (email, username, password, register_time) VALUES ($1, $2, $3, $4)', [email, username, hash, now], (error, result) => {
      if (error) {
        throw error
      }
      console.log('added');
    })
  });
  */

  const handler = (val) => {
    console.log(val);
  };

  auth.register(req.body)
    .then(handler);
});
var server = app.listen(3000, function () {
  console.log("Server has started on port 3000..");
});