// IMPORTS
const validator = require("email-validator");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Seed for bcrypt
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
        msg: '',
        ID: ''
      };

      // Check if email is valid
      if(!validator.validate(user.email) || user.email.lenght > 100) {
        response.msg = 'Invalid email';
        reject(response);
        return;
      }

      // Check if username has valid length
      if(user.username.length < 3) {
        response.msg = "Username must have more than 3 characthers";
        reject(response);
        return;
      }

      // Check if username has valid length
      if(user.username.length > 19) {
        response.msg = "Username must have less than 19 characthers";
        reject(response);
        return;
      }

      // Check if password is valid (longer than 5 chars)
      if(user.password.length < 6) {
        response.msg = 'Password needs to be 6 or more characthers';
        reject(response);
        return;
      }
  
      // Check if password and confpassword match
      if(user.password != user.confpassword) {
        response.msg = "Passwords don't match";
        reject(response);
        return;
      }
  
      // Check if email is unique
      pool.query('SELECT COUNT(1) FROM users WHERE email = $1' ,[user.email], (err, res) => {

        // Database error
        if (err) {
          console.log(err);
          response.msg = "DataBase error on uniqueness check";
          reject(response);
          return;
        }

        // Email is not unique
        else if(res.rows[0].count === '1' ) {
          response.msg =  "Email is already in use"; 
          reject(response);
          return;
        }

        // Email is unique. So check username
        else {
          // Check if username is unique
          pool.query('SELECT COUNT(1) FROM users WHERE username = $1', [user.username], (err, res) => {

            // Database error
            if (err) {
              console.log(err);
              response.msg =  "DataBase error on uniqueness check";
              reject(response);
              return;
            }

            // Username is not unique
            else if(res.rows[0].count === '1' ) {
              response.msg = "Username is already in use";
              reject(response);
              return;
            }

            // Both unique
            else {

              // Get date to save to DB
              const now = new Date();

              // Hash password
              bcrypt.hash(user.password, saltRounds, function(err, hash) {

                // INSERT INTO users
                pool.query('INSERT INTO users (email, username, password, register_time) VALUES($1, $2, $3, $4)'
                  , [user.email, user.username, hash, now], (err, res) => {

                  // Database error - Failed to INSERT 
                  if (err) {
                    console.log(err);
                    response.msg = "Can't INSERT to DataBase now";
                    reject(response);
                    return;
                  }

                  // User registered. Get id to send cookie
                  else {
                    pool.query('SELECT id FROM users WHERE username = $1', [user.username], (err, res) => {
                      response.ID = res.rows[0].id;
                      response.msg = "DONE";
                      resolve(response);
                      return;
                    });      
                  }
                });
              });    
            }
          });
        }
      });
    })
  },


  login: function(user) {
    return new Promise ((resolve, reject) => {

      let response = {
        msg: '',
        ID: '0'
      };

      pool.query('SELECT password FROM users WHERE username = $1'
        , [user.username], (err, res) => {

        // Database error
        if(err) {
          console.log(err)
          response.msg = 'Failed to login, please try again later';
          reject(response);
          return;
        }

        // No matching username
        else if(res.rows == 0) {
          response.msg = 'User not found';
          reject(response);
          return;
        }

        // User found password returned as res.rows[0].password
        else {
          // res == true if password is correct
          bcrypt.compare(user.password, res.rows[0].password, function(err, res) {
            if(res) {
              pool.query('SELECT id FROM users WHERE username = $1', [user.username], (err, res) => {
                response.ID = res.rows[0].id;
                resolve(response);
                return;
              });
            }
            else {
              response.msg = 'Wrong password';
              reject(response);
              return;
            }
        });
        }
      });
    })
  }
};