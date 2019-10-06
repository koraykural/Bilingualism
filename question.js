// IMPORTS
// Connect to DataBase
const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:KoraY*123@localhost:5432/bilingualism';
const pool = new Pool({
  connectionString: connectionString,
});

const log = (param) => {
  console.log(param);
};

// If you change this it will broke the system
// TODO: Fix updateSeen first
const QuestionCountPerServe = 5;
const typeAnswerCode = 8;







// ----------------------NEW QUESTION----------------------

// Will be used in insertQuetionToDB()
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
};

const newQuestion = (userID, form) => {
  return new Promise( async (resolve, reject) => {

    const ownername = await getUserName(userID);
    const now = new Date();

    // If question field is empty reject
    if(!(form.question.trim())){
      reject();
      return;
    }

    // If answer type is 'type' insert it
    if(form.answerType == 'type') {
      pool.query('INSERT INTO questions (ownerid, question, date, ownername) VALUES($1, $2, $3, $4)',
        [userID, form.question, now, ownername], (err, res) => {
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
    // If answer type is 'two-choice' validate input and insert
    else if(form.answerType == 'two-choice') {
      if(!form.answers[0] && !form.answers[1]) {
        reject();
        return;
      }
      if(form.correctAnswer != 1 && form.correctAnswer != 2) {
        reject();        
        return;
      }
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2, answertype, correctanswer, ownername) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', 
        [userID, form.question, now, form.answers[0], form.answers[1], true, form.correctAnswer, ownername], (err, res) => {
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
    // If answer type is 'four-choice' validate input and insert
    else if(form.answerType == 'four-choice') {
      if(!form.answers[0] && !form.answers[1] && !form.answers[2] && !form.answers[3]) {
        reject();
        return;
      }
      if(form.correctAnswer != 1 && form.correctAnswer != 2 && form.correctAnswer != 3 && form.correctAnswer != 4) {
        reject();
        return;
      }
      pool.query('INSERT INTO questions (ownerid, question, date, answer1, answer2, answer3, answer4, answertype, correctanswer, ownername) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [userID, form.question, now, form.answers[0], form.answers[1], form.answers[2], form.answers[3], true, form.correctAnswer, ownername], (err, res) => {
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
    // If answer type is none of all reject
    else {
      reject();
      return;
    }
  })
};














// TODO: Pre-vote for questions which the user itself voted before 
// SELECT questionid, type FROM votes WHERE userid = $1 AND (questionid = $2 OR questionid...)
// ----------------------SERVE QUESTIONS----------------------

const updateSeen = (userID, questions) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO seen (questionid, userid) VALUES($2,$1),($3,$1),($4,$1),($5,$1),($6,$1)', [userID, questions[0], questions[1], questions[2], questions[3], questions[4]], (err, res) => {
      if(err) {
        reject(err);
        return;
      } 
      else {
        resolve('Success');
        return;
      }
    });
  });
};

const selectVotes = (userID, questions) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT questionid, type FROM votes WHERE userid = $1 AND (questionid = $2 OR questionid = $3 OR questionid = $4 OR questionid = $5 OR questionid = $6)', [userID, questions[0], questions[1], questions[2], questions[3], questions[4]], (err, res) => {
      if(err) {
        reject(err);
        return;
      } 
      else {
        resolve(res.rows);
        return;
      }
    });
  });
};

const selectAnswers = (userID, questions) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT questionid, answer FROM answers WHERE userid = $1 AND (questionid = $2 OR questionid = $3 OR questionid = $4 OR questionid = $5 OR questionid = $6)', [userID, questions[0], questions[1], questions[2], questions[3], questions[4]], (err, res) => {
      if(err) {
        reject(err);
        return;
      } 
      else {
        resolve(res.rows);
        return;
      }
    });
  });
};

const serveQuestions = (userID) => {
  return new Promise( async (resolve, reject) => {
    // TODO: Don't serve the correct answer directly
    pool.query('SELECT id, ownername, upvotes, downvotes, question, answer1, answer2, answer3, answer4, answertype, correctanswer, comments, date FROM questions WHERE id NOT IN(SELECT questionid FROM seen WHERE userid = $1) ORDER BY date DESC LIMIT $2', [userID, QuestionCountPerServe] , async (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      else {
        const questions = res.rows;
        const questionIDs = questions.map(({ id }) => id);
        // If there is non question to serve, reject (user may have seen all)
        if(questionIDs.length == 0) {
          reject('No possible question');
          return;
        }
        else {
          await updateSeen(userID, questionIDs);
          // Check if user voted to the questions before
          const votes = await selectVotes(userID, questionIDs);
          // Check if user answered the question before
          const answers = await selectAnswers(userID, questionIDs);
          // Include the vote to the objects
          questions.forEach(element => {
            if(votes.some(vote => vote.questionid === element.id)) {
              element.userVote = votes.find(vote => vote.questionid == element.id).type
            }
            if(answers.some(answer => answer.questionid === element.id)) {
              element.previousAnswer = answers.find(answer => answer.questionid == element.id).answer
            }
          });
          resolve(questions);
          return;
        }    
      }
    });
  });
};

const deleteSeenData = (userID) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM seen WHERE userid = $1', [userID], async (err,res) => {
      if(err) {
        reject(err);
        return;
      }
      else {
        resolve();
        return;
      }
    })
  });
}










// ----------------------VOTE QUESTION----------------------

const learnPreviousVote = (questionID, userID) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT type FROM votes WHERE questionid = $1 AND userid = $2', [questionID, userID], (err,res) => {
      if(err) {
        console.log(err);
        reject('ERROR');
        return;
      }
      else {
        // If true or false
        if(res.rows[0]) {
          resolve(res.rows[0].type); // Boolean
          return;
        }
        else {
          resolve(undefined);
          return;
        }

      }
    })
  });
};

const insertIntoVotes = (questionID, userID, type) => {
  return new Promise((resolve,reject) => {
    console.log('inserting..')
    pool.query('INSERT INTO votes (questionid, userid, type) VALUES($1,$2,$3)', [questionID, userID, type], (err, res) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      else {
        // Increment votes in questions table
        if(type) {
          pool.query('UPDATE questions SET upvotes = upvotes+1 WHERE id = $1', [questionID]);
        }
        else {
          pool.query('UPDATE questions SET downvotes = upvotes+1 WHERE id = $1', [questionID]);
        }
        resolve(true);
        return;
      }
    });
  });
};

const convertVote = (questionID, userID, type) => {
  return new Promise((resolve,reject) => {
    pool.query('UPDATE votes SET type = $3 WHERE questionid = $1 AND userid = $2', [questionID, userID, type], (err, res) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      else {
        // Change votes in questions table
        if(type) {
          pool.query('UPDATE questions SET upvotes = upvotes+1, downvotes = downvotes-1 WHERE id = $1', [questionID]);
        }
        else {
          pool.query('UPDATE questions SET downvotes = downvotes+1, upvotes = upvotes-1 WHERE id = $1', [questionID]);
        }
        resolve(true);
        return;
      }
    });
  });
};

const retakeVote = (questionID, userID, type) => {
  return new Promise((resolve,reject) => {
    pool.query('DELETE FROM votes WHERE questionid = $1 AND userid = $2', [questionID, userID], (err, res) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      else {
        // Decrement votes in questions table
        if(type) {
          pool.query('UPDATE questions SET upvotes = upvotes-1 WHERE id = $1', [questionID]);
        }
        else {
          pool.query('UPDATE questions SET downvotes = downvotes-1 WHERE id = $1', [questionID]);
        }
        resolve(true);
        return;
      }
    });
  });
};

const vote = (userID, questionID, action) => {
  return new Promise( async (resolve, reject) => {
    let previous = await learnPreviousVote(questionID, userID);
    console.log('previous is: ' + previous);

    // Not voted before
    if(previous == null) {
      if(action.includes('retake')) {
        reject(false);
        return;
      }
      else if(action == 'voteUp') {
        await insertIntoVotes(questionID, userID, true);
        resolve(true);
        return;
      }
      else if(action == 'voteDown') {
        await insertIntoVotes(questionID, userID, false);
        resolve(true);
        return;
      }
      else {
        reject(false);
        return;
      }
    }
    // Voted up before
    else if(previous) {
      if(action == 'retakeDown' || action == 'voteUp') {
        reject(false);
        return;
      }
      else if(action == 'voteDown') {
        await convertVote(questionID, userID, false);
        resolve(true);
        return;
      }
      else if(action == 'retakeUp') {
        await retakeVote(questionID, userID, true);
        resolve(true);
        return;
      }
      else {
        reject(false);
        return;
      }
    }
    // Voted down before
    else {
      if(action == 'retakeUp' || action == 'voteDown') {
        reject(false);
        return;
      }
      else if(action == 'voteUp') {
        await convertVote(questionID, userID, true);
        resolve(true);
        return;
      }
      else if(action == 'retakeDown') {
        await retakeVote(questionID, userID, false);
        resolve(true);
        return;
      }
      else {
        reject(false);
        return;
      }
    }
  });
};











// -------------ANSWER QUESTION-------------

const increaseComments = (questionID) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE questions SET comments = comments + 1 WHERE id = $1', [questionID], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(true);
      return;
    })
  });
};

const isCommentedBefore = (questionID, userID) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM comments WHERE questionid = $1 AND userid = $2 LIMIT 1', [questionID, userID], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(res.rows[0]);
      return;
    })
  })
};

const isAnsweredBefore = (questionID, userID) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM answers WHERE questionid = $1 AND userid = $2 LIMIT 1', [questionID, userID], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      if(res.rows.length != 0) {
        resolve(true);
        return;
      }
      else {
        resolve(false);
        return;
      }
    })
  })
};

const insertIntoComments = (questionID, userID, comment) => {
  return new Promise( async (resolve, reject) => {
    const ownerName = await getUserName(userID);
    const now = new Date();
    await increaseComments(questionID);
    await insertIntoAnswers(questionID, userID, typeAnswerCode);
    pool.query('INSERT INTO comments (questionid, userid, comment, date, ownername) VALUES($1,$2,$3,$4,$5)', [questionID, userID, comment, now, ownerName], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(true);
      return;
    })
  })
};

const insertIntoAnswers = (questionID, userID, answer) => {
  return new Promise((resolve, rejecet) => {
    pool.query('INSERT INTO answers (questionid, userid, answer) VALUES($1, $2, $3)', [questionID, userID, answer], (err, res) => {
      if(err) {
        rejecet(err);
        return;
      }
      resolve(true);
      return;
    })
  })
};

const getCorrectAnswer = (questionID) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT correctanswer FROM questions WHERE id = $1', [questionID], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(res.rows[0]);
      return;
    })
  });
};

const answer = (userID, questionID, answerType, answer) => {
  return new Promise( async (resolve, reject) => {

    if(answerType == 'type') {
      if(await isCommentedBefore(questionID, userID)) {
        reject('Answered Before');
        return;
      }
      await insertIntoComments(questionID, userID, answer);
      resolve(true);
      return;
    }

    else if(answerType == 'multi') {
      if(await isAnsweredBefore(questionID, userID)) {
        reject('Answered Before');
        return;
      }
      correctAnswer =  await getCorrectAnswer(questionID);
      await insertIntoAnswers(questionID, userID, answer);
      resolve(correctAnswer);
      return;
    }

    else {
      reject('Unauthorized answer type!');
      return;
    }
  });

};








// -----------------SERVE COMMENTS----------------
const serveComments = (questionID) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT ownername, comment FROM comments WHERE questionid = $1', [questionID], (err, res) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(res.rows);
      return;
    })
  });
};




const deleteQuestion = (questionID) => {
  pool.query('DELETE FROM questions WHERE id = $1', [questionID], (err,res) => {
    if(err) {
      console.log(err);
    }
    return;
  })
}










// Functions to export
module.exports = {
  serveQuestions: serveQuestions,
  newQuestion: newQuestion,
  deleteSeenData: deleteSeenData,
  vote: vote,
  answer: answer,
  serveComments: serveComments,
  deleteQuestion: deleteQuestion
};