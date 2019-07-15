// IMPORTS
const validator = require("email-validator");
const bcrypt = require('bcrypt');

// Connect to DataBase
const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:KoraY*123@localhost:5432/bilingualism';
const pool = new Pool({
  connectionString: connectionString,
});




// Functions to export
// User parameter is an object {email, username, password, confpassword}
module.exports = {
  register: function(user) {
    return new Promise((resolve, reject) => {
      let response = {
        success: false,
        msg: ''
      };
      setTimeout(() => {
        if(user.username == 'Koray') {
          response.success = true;
          response.msg = 'DONE';
          resolve(response);
        }
        else {
          response.success = false;
          response.msg = 'ERROR';
          reject(response);
        }
      }, 2000);
    })
    
  },


  /*function(user, response) {
    console.log('Registeration request taken');
    setTimeout(function(response){
      response.msg = 'DONE'; 
    },2000)
    
    // Check if email is valid
    if(!validator.validate(user.email) || user.email.lenght > 100) {
      response.success = false;
      response.msg = 'Invalid email';
      return;
    }

    // Check if password is valid (longer than 5 chars)
    if(user.password.length < 6) {
      response.success = false;
      response.msg = 'Password needs to be 6 or more characthers';
      return;
    }

    // Check if username is not so long
    if(user.username.lenght > 19) {
      response.success = false;
      response.msg = "Username should be shorter";
      return;
    }

    // Check if password and confpassword match
    if(user.password != user.confpassword) {
      response.success = false;
      response.msg = "Passwords don't match";
      return;
    }

    // Check if email is unique
    pool.query('SELECT COUNT(1) FROM users WHERE email = $1' ,[user.email], (err, res) => {
    console.log("Checking DataBase to see if email already exist...");
    // Error on DataBase
    if (err) {
      response.success = false;
      console.log(err.stack);
      response.msg = "DataBase error on uniqueness check";
    }
    // Email is not unique
    else if(res.rows[0].count === '1' ) {
      response.success = false;
      response.msg =  "Email is already in use"; 
      return;
    }
    // Email is unique. So check username
    else {
      // Check if username is unique
      pool.query('SELECT COUNT(1) FROM users WHERE username = $1', [user.username], (err, res) => {
        console.log("Checking DataBase to see if username already exist...");
        // Error on DataBase
        if (err) {
          response.success = false;
          console.log(err.stack);
          response.msg =  "DataBase error on uniqueness check";
        }
        // Username is not unique
        else if(res.rows[0].count === '1' ) {
          response.success = false;
          response.msg = "Username is already in use";
        }
        // Both unique
        else {
          response.msg = 'UNIQUE';
          const now = new Date();

          console.log("Inserting to DB");
          // INSERT INTO users
          pool.query('INSERT INTO users (email, username, password, register_time) VALUES($1, $2, $3, $4)'
          , [user.email, user.username, user.password, now], (err, res) => {
            // Error on database - Failed to INSERT 
            if (err) {
              console.log(err.stack);
              response.success = false;
              response.msg = "Can't INSERT to DataBase now";
            }
            // User registered. "DONE" keyword to check in main function
            else {
              response.success = true;
              response.msg = "DONE";
            }
          });
        }
      });
    }
  });
  },
  */

  login: function(user) {
    console.log('Log in request taken');
    console.log('This is the email taken: ' + user.email);
    console.log('This is the password taken:' + user.password);
  }
};


// Add bcrypt before insert
// Learn async and callback YOU CANT RETURN
// Add css so you can add error to html