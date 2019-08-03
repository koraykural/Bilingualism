// Import modules
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./auth.js');
const multer  = require('multer')
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
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// cookieParser
app.use(cookieParser());
// Use static
app.use(express.static(__dirname + '/'));
// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CONSTS
const TWO_HOURS = 2 * 60 * 60 * 1000;

// TODO:  seperate files for profile route also recap
const getUserData = (userID) => {
  let user = {
    name: '',
    bio: '',
    pictureName: '0',
    languages: {}
  };
  return new Promise((resolve, reject) => {
    if(userID != null) {
      // Query for profile page
      const profileQuery = 'SELECT username, bio, picture, english, turkish, spanish, german, french, italian, russian, chinese, portuguese, arabic, hindi, japanese  FROM users WHERE id = $1'
      pool.query(profileQuery, [userID], (err, res) => {
        if(err) {
          user.name = 'UndefinedUser';
          user.bio = '';
          user.pictureName = '0';
          reject(user);
        }
        else {
          user.name = res.rows[0].username;
          user.bio = res.rows[0].bio;
          user.pictureName = res.rows[0].picture;
          user.languages.English = res.rows[0].english;
          user.languages.Turkish = res.rows[0].turkish;
          user.languages.Spanish = res.rows[0].spanish;
          user.languages.German = res.rows[0].german;
          user.languages.French = res.rows[0].french;
          user.languages.Italian = res.rows[0].italian;
          user.languages.Russian = res.rows[0].russian;
          user.languages.Chinese = res.rows[0].chinese;
          user.languages.Portuguese = res.rows[0].portuguese;
          user.languages.Arabic = res.rows[0].arabic;
          user.languages.Hindi = res.rows[0].hindi;
          user.languages.Japanese = res.rows[0].japanese;

          resolve(user); 
        }
      });
    }
    else {
      user.name = 'UndefinedUser';
      user.bio = '';
      user.pictureName = '0';
      reject(user);
    }
    
  });
};

const alterBio = (userID, bio) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE users SET bio = $1 WHERE id = $2', [bio, userID], (err, res) => {
      if(err) {
        reject(err);
      }
      else {
        resolve('Success');
      }
    });
  });
};

const alterLanguages = (userID, form) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE users SET english = $2, turkish = $3 , spanish = $4 , german = $5 , french = $6 , italian = $7 , russian = $8 , chinese = $9 , portuguese = $10 , arabic = $11 , hindi = $12 , japanese = $13 WHERE id = $1',
    [userID, form.English == 'on', form.Turkish == 'on', form.Spanish == 'on', form.German == 'on', form.French == 'on', form.Italian == 'on', form.Russian == 'on', form.Chinese == 'on', form.Portuguese == 'on', form.Arabic == 'on', form.Hindi == 'on', form.Japanese == 'on'], (err, res) => {
      resolve('Success');
    });
  });
};

const alterPicture = (userID, pictureName) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE users SET picture = $2 WHERE id = $1',
    [userID, pictureName], (err, res) => {
      resolve('Success');
    });
  });
};

// ****************** GET ROUTES ******************

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/feed", (req, res) => {
  res.render("feed");
});
app.get("/newQuestion", (req, res) => {
  res.render("newQuestion");
});
app.get("/profile", (req, res) => {
  // Get userID from cookie
  const userID = req.cookies.userID;

  const success = (user) => {
    res.render("profile", {username: user.name, bio: user.bio, languagesArray: user.languages, pictureName: user.pictureName});
  };

  const fail = (user) => {
    res.redirect('/');
  };
  getUserData(userID)
    .then(success)
    .catch(fail);
}); 
app.get("/delete", (req, res) => {
  res.render("delete");
})

/*
* TODO:
app.get('/:username', function (req, res, next) {
    users.get_user(req.params.username, function (err, results) {
        if(results[0]) {
            res.render('/profile', {
                title: 'Profile',
                userinfo: results[0]
            });
        } else {
            next();
        }
    });
});
*/

// ****************** POST ROUTES ******************

// Register POST
app.post("/register", async (req, res) => {
  const registerData = req.body;
  // TODO: Seperate files for then and catch functions
  // Redirect to feed if register is successful
  const successReg = (response) => {
    res.cookie('userID', response.ID, {httpOnly: false, maxAge: TWO_HOURS});
    res.redirect('/feed');
  };

  // Redirect to main page with an error if register fails
  const failReg = (response) => {
    res.render('index', {suc: false, msg: response.msg});
  }

  // Fire register function in the auth module
  auth.register(registerData)
    .then(successReg)
    .catch(failReg);
});

// Login POST
app.post("/login", async (req, res) => {
  const loginData = req.body;
  // TODO: Seperate files for then and catch functions
  // Redirect to feed if login is successful
  const successLog = (response) => {
    res.cookie('userID', response.ID, {httpOnly: false, maxAge: TWO_HOURS});
    res.redirect('/feed');
  };

  //Redirect to main page with an error if login fails
  const failLog = (response) => {
    res.render('index', {suc: false, msg: response.msg});
  }

  // fire login function in the auth module
  auth.login(loginData)
    .then(successLog)
    .catch(failLog);
});

app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect("/");
});

app.post("/alterBio", (req, res) => {
  // Redirect to profile
  const redirectProfile = (response) => {
    res.redirect('/profile');
  };
/*
  // TODO: Redirect to settings with an error
  const failAlterBio = (response) => {
    res.redirect('/profile');
  }
*/
  alterBio(req.cookies.userID, req.body.bio)
    .then(redirectProfile)
    .catch(redirectProfile);
});

app.post("/alterLanguages", (req, res) => {
  // Redirect to profile
  const redirectProfile = (response) => {
    res.redirect('/profile');
  };
/*
  // TODO: Redirect to settings with an error
  const failAlterBio = (response) => {
    res.redirect('/profile');
  }
*/

  alterLanguages(req.cookies.userID, req.body)
    .then(redirectProfile)
    .catch(redirectProfile);
    
});

const storage = multer.diskStorage({
  destination: './public/images/userPP/'
});

const upload = multer({ storage: storage })

app.post('/alterPicture', upload.single('picture'), function (req, res, next) {
  // Redirect to profile
  const redirectProfile = (response) => {
    res.redirect('/profile');
  };
  /*
    // TODO: Redirect to settings with an error
    const failAlterBio = (response) => {
      res.redirect('/profile');
    }
  */
  
  alterPicture(req.cookies.userID, req.file.filename)
    .then(redirectProfile)
    .catch(redirectProfile);
})

var server = app.listen(3000, function () {
  console.log("Server has started on port 3000..");
});