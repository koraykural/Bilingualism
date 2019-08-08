// Import modules
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./auth.js');
const profile = require('./profile.js')
const multer  = require('multer');
// Connect to DATABASE
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bilingualism',
  password: 'KoraY*123',
  port: 5432,
})
// Photo Storage
const storage = multer.diskStorage({
  destination: './public/images/userPP/'
});
const upload = multer({ storage: storage })
// Inıt App
const app = express();
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
// cookieParser
app.use(cookieParser());
// Use static
app.use(express.static(__dirname + '/'));
// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CONSTS
const PORT = 3000;
const TWO_HOURS = 2 * 60 * 60 * 1000;
const log = (param) => { // Short for console.log()
  console.log(param);
}














// Insert new Question to DB

const insertQuestion = (userID, question, answerType, answers) => {
  return new Promise((resolve, reject) => {
    const now = new Date();
    if(answerType == 'type') {
      pool.query('INSERT INTO questions (ownerid, question, date) VALUES($1, $2, $3)',
        [userID, question, now], (err, res) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        else {
          resolve();
          return;
        }
      });
    }
    if(answerType == 'two-choice') {
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2) VALUES($1, $2, $3, $4, $5)', 
        [userID, question, now, answers[0], answers[1]], (err, res) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        else {
          resolve();
          return;
        }
      });
    }
    if(answerType == 'four-choice') {
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2, answer3, answer4) \
        VALUES($1, $2, $3, $4, $5, $6, $7)', [userID, question, now, answers[0], answers[1], answers[2], answers[3]], (err, res) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        else {
          resolve();
          return;
        }
      });
    }
  });
}

















// ****************** GET ROUTES ******************
app.get("/", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(userID) {
    res.redirect("feed");
  }
  else {
    res.render("index");
  }
});
app.get("/feed", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(userID) {
    res.render("feed");
  }
  else {
    res.redirect("/");
  }
});
app.get("/delete", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(userID) {
    res.render("delete");
  }
  else {
    res.redirect("/");
  }
});
app.get("/newQuestion", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(userID) {
    res.render("newQuestion");
  }
  else {
    res.redirect("/");
  }
});
app.get("/profile", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;

  const success = (user) => {
    res.render("profile", {username: user.name, bio: user.bio, 
      languagesArray: user.languages, pictureName: user.avatarName});
  };
  const fail = () => {
    res.redirect('/');
  };
  profile.getUserData(userID)
    .then(success)
    .catch(fail);
}); 















// ****************** POST ROUTES ******************
app.post("/register", async (req, res) => {

  const registerData = req.body;

  const success = (response) => {
    res.cookie('userID', response.ID, {httpOnly: false, maxAge: TWO_HOURS});
    res.redirect('/feed');
  };
  const fail = (response) => {
    res.render('index', {suc: false, msg: response.msg});
  }
  auth.register(registerData)
    .then(success)
    .catch(fail);
});

app.post("/login", async (req, res) => {
  const loginData = req.body;
  const success = (response) => {
    res.cookie('userID', response.ID, {httpOnly: false, maxAge: TWO_HOURS});
    res.redirect('/feed');
  };
  const fail = (response) => {
    res.render('index', {suc: false, msg: response.msg});
  }
  auth.login(loginData)
    .then(success)
    .catch(fail);
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect("/");
});

app.post("/alterBio", (req, res) => {
  const redirectProfile = () => {
    res.redirect('/profile');
  };
  profile.alterBio(req.cookies.userID, req.body.bio)
    .then(redirectProfile)
    .catch(redirectProfile);
});

app.post("/alterLanguages", (req, res) => {
  const redirectProfile = () => {
    res.redirect('/profile');
  };
  profile.alterLanguages(req.cookies.userID, req.body)
    .then(redirectProfile)
    .catch(redirectProfile);
});

app.post('/alterPicture', upload.single('avatar'), (req, res) => {
  const redirectProfile = () => {
    res.redirect('/profile');
  };
  profile.alterAvatar(req.cookies.userID, req.file.filename)
    .then(redirectProfile)
    .catch(redirectProfile);
})

app.post('/newQuestion', (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(!userID) {
    res.redirect("/");
  }

  let errorMsg = "Can't post your question, try again later :(";

  // Promise .then .catch functions
  const success = () => {
    res.send();
  };
  const fail = () => {
    res.send(errorMsg);
  };
  
  const form = req.body;
  
  // If question filed is empty send error
  if(!(form.question.trim())){
    res.send(errorMsg);
    return;
  }

  // If answer type is 'type' insert it
  if(form.answerType == 'type') {
    insertQuestion(userID, form.question, form.answerType, form.answers)
      .then(success)
      .catch(fail);
  }

  // If answer type is 'two-choice' or 'four-choice' validate inputs
  // Then concat answer type and correct answer to first question
  // [2-1]  -> two-choice first choice is correct
  // [3-2]  -> four-choice second choice is correct
  else if(form.answerType == 'two-choice') {
    if(form.answers[0] && form.answers[1]) {
      if(form.correctAnswer == 1) {
        form.answers[0] = '[2-1]'.concat(form.answers[0]);
      }
      else if(form.correctAnswer == 2) {
        form.answers[0] = '[2-2]'.concat(form.answers[0]);
      }
      else {
        res.send(errorMsg);
        return;
      }
    }
    insertQuestion(userID, form.question, form.answerType, form.answers)
      .then(success)
      .catch(fail);
  }
  else if(form.answerType == 'four-choice') {
    if(form.answers[0] && form.answers[1] && form.answers[2] && form.answers[3]) {
      if(form.correctAnswer == 1) {
        form.answers[0] = '[3-1]'.concat(form.answers[0]);
      }
      else if(form.correctAnswer == 2) {
        form.answers[0] = '[3-2]'.concat(form.answers[0]);
      }
      else if(form.correctAnswer == 3) {
        form.answers[0] = '[3-3]'.concat(form.answers[0]);
      }
      else if(form.correctAnswer == 3) {
        form.answers[0] = '[3-4]'.concat(form.answers[0]);
      }
      else {
        res.send(errorMsg);
        return;
      }
    }
    insertQuestion(userID, form.question, form.answerType, form.answers)
      .then(success)
      .catch(fail);
  }
  // If answer type is none of all send error
  else {
    res.send(errorMsg);
    return;
  }

  
  
})

const server = app.listen(PORT, function () {
  log("Server has started on port 3000..");
});