// Import modules
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const multer  = require('multer');
const cookieParser = require('cookie-parser');
// Custom Modules
const auth = require('./auth.js');
const profile = require('./profile.js')
const question = require('./question.js')
// Connect to DATABASE
const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
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
app.use(express.static(path.join(__dirname, 'public')));
// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CONSTS
const PORT = process.env.PORT;
const TWO_HOURS = 2 * 60 * 60 * 1000;
const log = (param) => { // Short for console.log()
  console.log(param);
}
// TODO: Change this to user depended later
const dark = true;










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
app.get("/feed", async (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(!userID) {
    res.redirect("/");
  }
  let username;

  const success = (res) => {
    username = res;
  };
  const fail = (res) => {
    res.redirect("/");
  };

  await auth.getUsernameFromID(userID)
    .then(success)
    .catch(fail);

  if(userID) {
    if(dark) {
      res.render("feed-dark", {username: username});
    }
    else {
      res.render("feed", {username:username});
    }
  }
  else {
    res.redirect("/");
  }
});

app.get("/delete", async (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(!userID) {
    res.redirect("/");
  }
  let username;

  const success = (res) => {
    username = res;
  };
  const fail = (res) => {
    res.redirect("/");
  };

  await auth.getUsernameFromID(userID)
    .then(success)
    .catch(fail);

  if(userID) {
    if(dark) {
      res.render("delete-dark", {username:username});
    }
    else {
      res.render("delete", {username:username});
    }
  }
  else {
    res.redirect("/");
  }
});

app.get("/newQuestion", async (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(!userID) {
    res.redirect("/");
  }
  let username;

  const success = (res) => {
    username = res;
  };
  const fail = (res) => {
    res.redirect("/");
  };

  await auth.getUsernameFromID(userID)
    .then(success)
    .catch(fail);

  if(userID) {
    if(dark) {
      res.render("newQuestion-dark", {username:username});
    }
    else {
      res.render("newQuestion", {username:username});
    }
  }
  else {
    res.redirect("/");
  }
});
app.get("/profile/:username", async (req,res) => {
  const username = req.params.username;
  if(!username) {
    res.redirect("/");
  }
  const userID = await auth.getIdFromUsername(username);
  const success = (user) => {
    if(dark) {
      res.render("profile-dark", {username: user.name, bio: user.bio, 
        languagesArray: user.languages, pictureName: user.avatarName});
    }
    else {
      res.render("profile", {username: user.name, bio: user.bio, 
        languagesArray: user.languages, pictureName: user.avatarName});
    }
  };
  const fail = () => {
    res.redirect('/');
  };

  profile.getUserData(userID)
    .then(success)
    .catch(fail);
});
app.get("/about", async (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  if(!userID) {
    res.redirect("/");
  }
  let username;

  const success = (res) => {
    username = res;
  };
  const fail = (res) => {
    res.redirect("/");
  };

  await auth.getUsernameFromID(userID)
    .then(success)
    .catch(fail);
  
  if(dark) {
    res.render("about-dark", {username:username});
  }
  else {
    res.render("about", {username:username});
  }
});














// ****************** POST ROUTES ******************

// Auth Routes
app.post("/register", (req, res) => {

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

app.post("/login", (req, res) => {

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








// Profile Routes
app.post("/alterBio", (req, res) => {
  const redirectProfile = () => {
    res.redirect('/feed');
  };
  profile.alterBio(req.cookies.userID, req.body.bio)
    .then(redirectProfile)
    .catch(redirectProfile);
});

app.post("/alterLanguages", (req, res) => {
  const redirectProfile = () => {
    res.redirect('/feed');
  };
  profile.alterLanguages(req.cookies.userID, req.body)
    .then(redirectProfile)
    .catch(redirectProfile);
});

app.post('/alterPicture', upload.single('avatar'), (req, res) => {
  res.redirect('/feed');
  /*
  const redirectProfile = () => {
    res.redirect('/feed');
  };
  profile.alterAvatar(req.cookies.userID, req.file.filename)
    .then(redirectProfile)
    .catch(redirectProfile);
    */
});

// Check if User And QuestionID matches
app.post('/askAuth', (req, res) => {
  const userID = req.cookies.userID;
  const questionID = req.body.questionID;

  // Promise .then .catch functions
  const success = (response) => {
    res.send(response[0].exists)
  };
  const fail = (response) => {
    res.send(response[0].exists)
  };

  auth.checkUser(questionID, userID)
    .then(success)
    .catch(fail);
})







// Question routes
app.post('/newQuestion', (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;
  // Redirect if there is no cookie
  if(!userID) {
    res.redirect("/");
  }

  // New question form fields
  const form = req.body;

  // Promise .then .catch functions
  const success = () => {
    res.send();
  };
  const fail = () => {
    res.send("Can't post your question, try again later :(");
  };
  
  question.newQuestion(userID, form)
    .then(success)
    .catch(fail);
});

app.post('/serveQuestion', (req,res) => {

  const userID = req.cookies.userID;

  const success = (questions) => {
    if(questions.length) {
      res.send(questions);
    }
    else{
      res.send(false);
    }
  };
  const fail = () => {
    res.send(false);
  };
  
  question.serveQuestions(userID)
    .then(success)
    .catch(fail);
});

app.post('/deleteSeenData', (req,res) => {

  const userID = req.cookies.userID;

  const success = (questions) => {
    if(questions.length) {
      res.send(questions);
    }
    else{
      res.send(false);
    }
  };
  const fail = () => {
    res.send(false);
  };

  question.deleteSeenData(userID)
    .then(success)
    .catch(fail);
})

app.post('/getAnswer', (req,res) => {
  const userID = req.cookies.userID;
  const questionID = req.body.questionID;
  const answerType = req.body.answerType;
  const answer = req.body.userAnswer;

  const success = (correctAnswer) => {
    res.send(correctAnswer);
  };
  const fail = (error) => {
    res.send(error);
  };

  question.answer(userID, questionID, answerType, answer)
  .then(success)
  .catch(fail);
});

app.post('/voteQuestion', (req,res) => {
  const userID = req.cookies.userID;
  const questionID = req.body.questionID;
  const action = req.body.action;

  const success = () => {
    res.send(true);
  };
  const fail = () => {
    res.send(false);
  };
  
  question.vote(userID, questionID, action)
    .then(success)
    .catch(fail);
});

app.post('/serveComments', (req,res) => {
  const questionID = req.body.questionID;

  const success = (comments) => {
    res.send(comments);
  };
  const fail = () => {
    res.send(false);
  };

  question.serveComments(questionID)
    .then(success)
    .catch(fail);
});

app.post('/deleteQuestion', (req,res) => {
  const userID = req.cookies.userID;
  const questionID = req.body.questionID;

  // Promise .then .catch functions
  const success = () => {
    question.deleteQuestion(questionID);
    res.send(true)
  };
  const fail = () => {
    res.send(false)
  };

  auth.checkUser(questionID, userID)
    .then(success)
    .catch(fail);
})














const server = app.listen(PORT, function () {
  log("Server has started on port 3000..");
});