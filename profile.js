// Connect to DATABASE
const Pool = require('pg').Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

module.exports = {

  getUserData: (userID) => {
    let user = {
      languages: {}
    };
    return new Promise((resolve, reject) => {
      if(userID != null) {
        // Query for profile page
        const profileQuery = 'SELECT id, username, bio, picture, english, turkish, spanish, german, french, italian, russian, chinese, portuguese, arabic, hindi, japanese  FROM users WHERE id = $1'
        pool.query(profileQuery, [userID], (err, res) => {
          if(err) {
            user.name = 'UndefinedUser';
            user.bio = '';
            user.avatarName = '0';
            reject(user);
          }
          else {
            user.id = res.rows[0].id;
            user.name = res.rows[0].username;
            user.bio = res.rows[0].bio;
            user.avatarName = res.rows[0].picture;
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
        user.avatarName = '0';
        reject(user);
      }
    });
  },

  alterBio: (userID, bio) => {
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
  },

  alterLanguages: (userID, form) => {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE users SET english = $2, turkish = $3 , spanish = $4 , german = $5 , french = $6 , italian = $7 , russian = $8 , chinese = $9 , portuguese = $10 , arabic = $11 , hindi = $12 , japanese = $13 WHERE id = $1',
      [userID, form.English == 'on', form.Turkish == 'on', form.Spanish == 'on', form.German == 'on', form.French == 'on', form.Italian == 'on', form.Russian == 'on', form.Chinese == 'on', form.Portuguese == 'on', form.Arabic == 'on', form.Hindi == 'on', form.Japanese == 'on'], (err, res) => {
        resolve('Success');
      });
    });
  },

  alterAvatar: (userID, avatarName) => {
    /*
    return new Promise((resolve, reject) => {
      pool.query('UPDATE users SET picture = $2 WHERE id = $1',
      [userID, avatarName], (err, res) => {
        resolve('Success');
      });
    });
    */
   return 'success';
  }
}