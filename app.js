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










const getUserName = userID => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT username FROM users WHERE id = $1', [userID], (err,res) => {
      if(err) {
        console.log(err);
        reject();
        return;
      }
      else {
        resolve(res.rows[0].username);
        return;
      }
    })
  })
}



// Insert new Question to DB

const insertQuestion = (userID, question, answerType, answers, correctAnswer) => {
  return new Promise( async (resolve, reject) => {
    const ownername = await getUserName(userID);
    const now = new Date();
    if(answerType == 'type') {
        pool.query('INSERT INTO questions (ownerid, question, date, ownername) VALUES($1, $2, $3, $4)',
        [userID, question, now, ownername], (err, res) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        else {
          resolve();
          return;
        }
      })
    }
    if(answerType == 'two-choice') {
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2, answertype, correctanswer, ownername) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', 
        [userID, question, now, answers[0], answers[1], true, correctAnswer, ownername], (err, res) => {
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
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2, answer3, answer4, answertype, correctanswer, ownername) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [userID, question, now, answers[0], answers[1], answers[2], answers[3], true, correctAnswer, ownername], (err, res) => {
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




const getQuestions = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT id, ownerid, upvotes, downvotes, question, answer1, answer2, answer3, answer4, answertype, correctanswer, comments, date, ownername FROM questions ORDER BY date DESC LIMIT 5', (err, res) => {
      if(err) {
        reject(err);
        return;
      } 
      else {
        resolve(res.rows);
        return;
      }
    });
  })
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
});

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
  else if(form.answerType == 'two-choice') {
    if(!form.answers[0] && !form.answers[1]) {
      log('here1');
      res.send(errorMsg);
      return;
    }
    if(form.correctAnswer != 1 && form.correctAnswer != 2) {
      res.send(errorMsg);
      return;
    }
    insertQuestion(userID, form.question, form.answerType, form.answers, form.correctAnswer)
      .then(success)
      .catch(fail);
  }
  else if(form.answerType == 'four-choice') {
    if(!form.answers[0] && !form.answers[1] && !form.answers[2] && !form.answers[3]) {
      res.send(errorMsg);
      return;
    }
    if(form.correctAnswer != 1 && form.correctAnswer != 2 && form.correctAnswer != 3 && form.correctAnswer != 4) {
      res.send(errorMsg);
      return;
    }
    insertQuestion(userID, form.question, form.answerType, form.answers, form.correctAnswer)
      .then(success)
      .catch(fail);
  }
  // If answer type is none of all send error
  else {
    res.send(errorMsg);
    return;
  }
});
// New post routes
// Vote, Send Question, Get Answer, Send Comments
app.post('/getAnswer', (err,res) => {
  const userID = req.cookies.userID;
  const questionID = req.body.questionID;
  const answerType = req.body.answerType;
  const answer = req.body.answer;

});

app.post('/voteQuestion', (err,res) => {
  const userID = req.cookies.userID;

});

app.post('/sendQuestion', (err,res) => {
  const success = (questions) => {
    res.send(questions);
  };
  const fail = () => {
    res.send('fail');
  };
  
  getQuestions()
    .then(success)
    .catch(fail);
});

app.post('/sendComments', (err,res) => {
  const userID = req.cookies.userID;

});

const server = app.listen(PORT, function () {
  log("Server has started on port 3000..");
});