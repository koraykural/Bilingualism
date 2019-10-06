$(document).ready(() => {

  // ------------------------GET QUESTION------------------------

  // ADD QUESTIONS TO FEED
  // Sent from DB as an Array
  const renderQuestions = (arr) => {
    arr.forEach(element => {
      // Type question template
      if(!element.answertype) {
        let template = $('template.type').html().trim();
        template = template.replace('{id}', element.id);
        template = template.replace('{question}', element.question);
        template = template.replace('{upvotes}', element.upvotes);
        template = template.replace('{downvotes}', element.downvotes);
        template = template.replace('{username}', element.ownername);
        template = template.replace('{numComments}', element.comments);
        $('body').append(template);
      }
      // Two-choice question template
      else if(element.answertype && !element.answer3) {
        let template = $('template.multi2').html().trim();
        template = template.replace('{id}', element.id);
        template = template.replace('{question}', element.question);
        template = template.replace('{upvotes}', element.upvotes);
        template = template.replace('{downvotes}', element.downvotes);
        template = template.replace('{answer1}', element.answer1);
        template = template.replace('{answer2}', element.answer2);
        template = template.replace('{username}', element.ownername);
        template = template.replace('{numComments}', element.comments);
        $('body').append(template);
      }
      // Four-choice question template
      else {
        let template = $('template.multi4').html().trim();
        template = template.replace('{id}', element.id);
        template = template.replace('{question}', element.question);
        template = template.replace('{upvotes}', element.upvotes);
        template = template.replace('{downvotes}', element.downvotes);
        template = template.replace('{answer1}', element.answer1);
        template = template.replace('{answer2}', element.answer2);
        template = template.replace('{answer3}', element.answer3);
        template = template.replace('{answer4}', element.answer4);
        template = template.replace('{username}', element.ownername);
        template = template.replace('{numComments}', element.comments);
        $('body').append(template);
      }

      // Pre-vote questions if user voted before
      const thisQuestion = $('#q' + element.id);
      const upButton = thisQuestion.find('.votes .up');
      const downButton = thisQuestion.find('.votes .down');

      if(element.userVote == true) {
        $(upButton).addClass('voted');
        $(upButton).find('img').attr('src', './public/images/up-voted.svg');
        $(upButton).find('p').css('color', '#2DD221');

      }
      else if(element.userVote == false) {
        $(downButton).addClass('voted');
        $(downButton).find('img').attr('src', './public/images/down-voted.svg');
        $(downButton).find('p').css('color', '#DD1D1D');
      }

      // Pre-answer questions if user answered before
      const previousAnswer = element.previousAnswer;
      const correctAnswer = element.correctanswer;
      const answerType = element.answertype; // true-multi/null-type
      const previousChoice = thisQuestion.find('#a' + previousAnswer);
      const correctChoice = thisQuestion.find('#a' + correctAnswer);

      if(previousAnswer) {
        if(answerType) { // Multi Choice
          const choices = $.map(thisQuestion.find('.multi').children(), (value) => {return [value];});
          choices.forEach(choice => {
            $(choice).attr('disabled', true);
            $(choice).css('opacity','0.5');
          });
          correctChoice.css('opacity','1');
          correctChoice.addClass('green');
          if(correctAnswer != previousAnswer) {
            correctChoice.removeClass('green');
            correctChoice.css('opacity','0.7');
            correctChoice.addClass('wrongGreen');
            previousChoice.addClass('red');
            previousChoice.css('opacity', '1');
          }
        } 
        else { // Type
          const sendButton = thisQuestion.find('button.submit');
          const inputField = thisQuestion.find('.type input');
          sendButton.attr('disabled', true);
          inputField.attr('placeholder', 'You have already answered this.');
          inputField.attr('disabled', true);
        }
      }
      // If not answered before, disable comments button
      else {
        thisQuestion.find('.comments').attr('disabled', true);
      }

      // Add Listeners to newly added questions
      thisQuestion.find(".answers .multi button").click(sendAnswerMulti);
      thisQuestion.find(".answers button.submit").click(sendAnswerType);
      thisQuestion.find(".votes button").click(voteQuestion);
      thisQuestion.find(".comments").click(requestComments);
      thisQuestion.find(".actions").click(showQuestionActions);
    });

    // Make it feed ready to take more questions requests
    $(window).data('ajax_in_progress', false);
  };








  // TODO: Fix for mobile
  // Send request to the server to get more questions
  const scrollBottom = () => {

    // Determine if ready to send request
    let isBusy = $(window).data('ajax_in_progress');
    let isBottom = false;
    if($('body').innerHeight() + 1 >= $('body')[0].scrollHeight) {
      isBottom = $(window).scrollTop() + $(window).height() +1 >= $('body').innerHeight()
    } else {
      isBottom = $('body').scrollTop() + $('body').innerHeight() + 50 >= $('body')[0].scrollHeight
    }

    if(isBottom && !isBusy) {
      // Prevent it from sending more requests
      $(window).data('ajax_in_progress', true);
      // Load more questions
      loadMore();
    }
  };




  // @TODO: This variable is trash
  // Store if there is 'Load more' button at the bottom
  let loadMoreButton;

  // If scroll bottom doesn't work: Load more question button
  const addLoadMoreButton = () => {
    $('body').append(
      $('<button/>')
        .attr("id", "loadMore")
        .addClass('blueButton')
        .addClass('feedButton')
        .append("<p/>")
          .addClass('bigtext')
          .text("Load some more")
    );

    loadMoreButton = false;
    $('#loadMore').click(loadMore);
  };

  const loadMore = () => {
    $.ajax({
      type: 'POST',
      url: '/serveQuestion',
      dataType: 'json',
      success: loadMoreCallback
    });
  }

  const loadMoreCallback = (response) => { // Array of obj

    // Delete button
    $('#loadMore').remove();

    // If user has seen al questions
    if(!response) {
      noQuestionLeft();
    }
    else {
      renderQuestions(response);
      addLoadMoreButton();
    }
  };





  
  // IF USER HAS SEEN ALL QUESTIONS ON DATABASE
  // Show a button to delete seen data
  const noQuestionLeft = () => {
    $('body').append(
      $('<button/>')
        .attr("id", "noQuestionLeft")
        .addClass('blueButton')
        .addClass('feedButton')
        .append("<p/>")
          .addClass('bigtext')
          .text("Load again")
    );
    loadMoreButton = true;
    $('#noQuestionLeft').click(deleteSeenData);
  };

  // noQuestionLeft button click:
  const deleteSeenData = () => {
    $.ajax({
      type: 'POST',
      url: '/deleteSeenData',
      dataType: 'json',
      success: deleteSeenDataCallback
    });
  };

  // After deleting seen data Render newly questions
  const deleteSeenDataCallback = () => {
   window.location.reload(false); 
  };


  // FIRST LOAD AND SCROLL LISTENERS
  $(window).data('ajax_in_progress', false);
  // At first reload
  loadMore();
  // Mobile
  $(window).scroll(scrollBottom);
  // Desktop
  $('content').scroll(scrollBottom);



























  // ------------------------SEND ANSWER------------------------

  // SEND ANSWER 'Type'
  const sendAnswerType = (e) => {
    const answerType = 'type';
    const thisQuestion = $(e.currentTarget.parentElement.parentElement.parentElement);
    const sendButton = thisQuestion.find('button.submit');
    const inputField = thisQuestion.find('.type input');
    sendButton.attr('disabled', true);
    inputField.attr('placeholder', 'You have already answered this.');
    inputField.attr('disabled', true);
    const questionID = thisQuestion.attr('id').substr(1);
    // Get written answer
    const userAnswer = $(e.target.parentElement.previousSibling).val();
    
    // Send Ajax
    $.ajax({
      type: 'POST',
      url: '/getAnswer',
      dataType: 'json',
      data: {
        questionID: questionID,
        answerType: answerType,
        userAnswer: userAnswer
      },
      success: () => {
        let buttonString = thisQuestion.find('.comments p').text();
        let numOfComments = buttonString.substring(
          buttonString.lastIndexOf("(") + 1, 
          buttonString.lastIndexOf(")")
        );
        numOfComments = parseInt(numOfComments) + 1;
        if(buttonString[0] == 'A') {
          buttonString = 'Answers (' + numOfComments + ')';
        }
        else {
          buttonString = 'Discussion (' + numOfComments + ')';
        }
        console.log(buttonString);
        thisQuestion.find('.comments p').text(buttonString);
        thisQuestion.find('.comments').attr('disabled', false);
      }
    });
  };



  // SEND ANSWER 'Multi'
  const sendAnswerMulti = (e) => {
    const answerType = 'multi';
    const thisQuestion = $(e.currentTarget.parentElement.parentElement.parentElement);
    const questionID = thisQuestion.attr('id').substr(1);
    const userAnswer = $(e.currentTarget).attr('id')[1];
    $(e.currentTarget).attr("disabled", true);
    const siblings = $.map($(e.currentTarget).siblings(), (value) => {return [value];});

    $(e.currentTarget).css('opacity', '1');
    siblings.forEach(element => {
      $(element).attr('disabled', true);
      $(element).css('opacity','0.5');
    });

    // Send Ajax
    $.ajax({
      type: 'POST',
      url: '/getAnswer',
      dataType: 'json',
      data: {
        questionID: questionID,
        answerType: answerType,
        userAnswer: userAnswer
      },
      success: (res) => {
        correctAnwer = res.correctanswer;
        if(userAnswer == correctAnwer) {
          $(e.currentTarget).addClass('green');
          siblings.forEach(element => {
            $(element).css('opacity','0.5');
          });
        }
        else {
          $(e.currentTarget).addClass('red');
          const correctButton = $(e.currentTarget.parentElement).find('#a' + correctAnwer);
          correctButton.addClass('wrongGreen');
          correctButton.css('opacity','0.7');
        }
        thisQuestion.find('.comments').attr('disabled', false);
      }
    });
  };


















  // ------------------------SHOW COMMENTS-----------------------

  const requestComments = (e) => {
    const questionID = $(e.currentTarget.parentElement.parentElement).attr('id').substr(1);
     
    // Send Ajax
    $.ajax({
      type: 'POST',
      url: '/serveComments',
      dataType: 'json',
      data: {
        questionID: questionID,
      },
      success: showComments
    });
  };

  const noCommentTexts = ['There is nothing to show here','Burda gösterilecek bir şey yok', 'No hay nada que mostrar aquí', "Il n'y a rien à montrer ici", "Hier gibt es nichts zu zeigen", "Non c'è niente da mostrare qui", "Não há nada para mostrar aqui", "ここに示すものは何もありません", "没有什么可以在这里显示"];
  const showComments = (comments) => {
    $('body').append(
      $('<div/>')
        .addClass('darkenPage')
        .append("<div class='post'/>")
    );
    const commentContainer = $('.darkenPage .post');
    if(comments.length == 0) {
      noCommentTexts.forEach(text => {
        commentContainer.append(
          $('<p/>')
            .text(text)
        );
        commentContainer.append(
          $('<hr/>')
        );
      });
    }
    else {
      comments.forEach(comment => {
        commentContainer.append(
          $('<p/>')
            .text(comment.comment)
        );
        commentContainer.append(
          $('<p/>')
            .addClass('smalltext')
            .css('color', '#999999')
            .css('float', 'right')
            .text(comment.ownername)
        );
        commentContainer.append(
          $('<hr/>')
        )
      });
    }
    
    

    $(document).click(function (e) {
      if (!$(".darkenPage .post").is(e.target) && $(".darkenPage .post").has(e.target).length === 0) {
          $(".darkenPage").remove();
      }
 
  });
  };










  // ------------------------VOTE QUESTION-----------------------

  const sendVote = (questionID, action) => {
    $.ajax({
      type: 'POST',
      url: '/voteQuestion',
      dataType: 'json',
      data: {
        questionID: questionID,
        action: action
      },
      success: sendVoteCallback
    });
  }

  const sendVoteCallback = (response) => {
    
  }

  const voteQuestion = (e) => {
    let voteCount = parseInt($(e.currentTarget).find('p').text()); // Number of current votes (clicked)
    let formerVote = $(e.currentTarget.parentElement).find('.voted').attr('class');
    const vote = $(e.currentTarget).attr('class'); // 'up' or 'down'
    const questionID = $(e.currentTarget.parentElement.parentElement.parentElement).attr('id').substr(1);

    // CHANGE VISUALS

    // If user already voted
    if($(e.currentTarget).hasClass('voted')) {
      voteCount -= 1;
      $(e.currentTarget).find('p').text(voteCount);
      $(e.currentTarget).removeClass('voted');
      if($(e.currentTarget).attr('class') == 'up') {
        $(e.currentTarget).find('img').attr('src', './public/images/up-arrow.svg');
        $(e.currentTarget).find('p').css('color', '#A1BF9F');
      }
      else if($(e.currentTarget).attr('class') == 'down') {
        $(e.currentTarget).find('img').attr('src', './public/images/down-arrow.svg');
        $(e.currentTarget).find('p').css('color', '#DB8989');
      }
    }


    // If user clicked upvote first time
    if(vote == 'up') {
      $(e.currentTarget).find('img').attr('src', './public/images/up-voted.svg');
      $(e.currentTarget).find('p').css('color', '#2DD221');
      $(e.currentTarget).addClass('voted');
      voteCount += 1;
      $(e.currentTarget).find('p').text(voteCount);
      if(formerVote) {
        $(e.currentTarget.nextSibling).removeClass('voted');
        $(e.currentTarget.nextSibling).find('img').attr('src', './public/images/down-arrow.svg');
        $(e.currentTarget.nextSibling).find('p').css('color', '#DB8989');
        let formerVoteCount = parseInt($(e.currentTarget.nextSibling).find('p').text());
        formerVoteCount -= 1;
        $(e.currentTarget.nextSibling).find('p').text(formerVoteCount);
      }
      sendVote(questionID, 'voteUp');
    }
    else if(vote == 'down') {
      $(e.currentTarget).find('p').css('color', '#DD1D1D');
      $(e.currentTarget).find('img').attr('src', './public/images/down-voted.svg');
      $(e.currentTarget).addClass('voted');
      voteCount += 1;
      $(e.currentTarget).find('p').text(voteCount);
      if(formerVote) {
        $(e.currentTarget.previousSibling).removeClass('voted');
        $(e.currentTarget.previousSibling).find('img').attr('src', './public/images/up-arrow.svg');
        $(e.currentTarget.previousSibling).find('p').css('color', '#A1BF9F');
        let formerVoteCount = parseInt($(e.currentTarget.previousSibling).find('p').text());
        formerVoteCount -= 1;
        $(e.currentTarget.previousSibling).find('p').text(formerVoteCount);
      }
      sendVote(questionID, 'voteDown');
    }
    // If user retakes his/her vote
    else if(vote == 'up voted') {
      sendVote(questionID, 'retakeUp');
    }
    else if(vote == 'down voted') {
      sendVote(questionID, 'retakeDown');
    }
  };








  // ----------------- Question Actions -----------------

  const showQuestionActions = (e) => {
    const questionID = $(e.currentTarget.parentElement.parentElement.parentElement).attr('id').substr(1);

    // Ask if user is the owner
    $.ajax({
      type: 'POST',
      url: '/askAuth',
      dataType: 'json',
      data: {
        questionID: questionID,
      },
      success: (isOwner) => {
        if(isOwner) {
          if($(e.currentTarget.parentElement).find('.delete').length) {
            $(e.currentTarget).animate(
              { deg: 0 },
              {
                duration: 400,
                step: function(now) {
                  $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
              }
            );
            $('#q' + questionID + " button.delete, " +'#q' + questionID + " button.edit").animate({width:'toggle'},200, () => {
              $('#q' + questionID + " .delete").remove();
              $('#q' + questionID + " .edit").remove();
            });
          }
          else {
            $(e.currentTarget).animate(
              { deg: 90 },
              {
                duration: 400,
                step: function(now) {
                  $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
              }
            );
            $('#q' + questionID + ' .bottom-bar .actions').after(
              $('<button/>')
                .addClass('edit')
                .css('display', 'none')
                .attr('disabled', true)
            );
            $('#q' + questionID + ' .bottom-bar .actions').after(
              $('<button/>')
                .addClass('delete')
                .css('display', 'none')
            );
            $('#q' + questionID + ' button.delete').append(
              $('<p/>')
                .text('Delete')
                .css('color', '#DD1D1D')
  
            );
            $('#q' + questionID + ' button.edit').append(
              $('<p/>')
                .text('Edit')
            );
            $('#q' + questionID + " button.delete, " +'#q' + questionID + " button.edit").animate({width:'toggle'},200);
          }
        }
        else {
          if($(e.currentTarget.parentElement).find('.save').length) {
            $(e.currentTarget).animate(
              { deg: 0 },
              {
                duration: 400,
                step: function(now) {
                  $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
              }
            );
            $('#q' + questionID + " button.save, " +'#q' + questionID + " button.report").animate({width:'toggle'},200, () => {
              $('#q' + questionID + " .save").remove();
              $('#q' + questionID + " .report").remove();
            });
          }
          else {
            $(e.currentTarget).animate(
              { deg: 90 },
              {
                duration: 400,
                step: function(now) {
                  $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
              }
            );
            $('#q' + questionID + ' .bottom-bar .actions').after(
              $('<button/>')
                .addClass('save')
                .css('display', 'none')
                .attr('disabled', true)
            );
            $('#q' + questionID + ' .bottom-bar .actions').after(
              $('<button/>')
                .addClass('report')
                .css('display', 'none')
                .attr('disabled', true)
            );
            $('#q' + questionID + ' button.save').append(
              $('<p/>')
                .text('Save')
            );
            $('#q' + questionID + ' button.report').append(
              $('<p/>')
                .text('Report')
                .css('color', '#DD1D1D')
            );
  
            $('#q' + questionID + " button.save, " +'#q' + questionID + " button.report").animate({width:'toggle'},200);
          }
        }
        $('#q' + questionID +' .delete').click(deleteQuestion);
      }
    });
    const deleteQuestion = () => {
      $.ajax({
        type: 'POST',
        url: '/deleteQuestion',
        dataType: 'json',
        data: {
          questionID: questionID,
        },
        success: (response) => {
          if(response) {
            $('#q' + questionID).remove();
          }
          else {
            window.location.reload(false); 
          }
        }
      });
    }
  };











  // DARK THEME CHANGES

  if($('body').hasClass('dark')) {

  }


  

  // MISC
  //////////////////////////////////////////////////////////
  let showLinks = false;
  $('.showLinks').click((e) => {
    // If div is open
    if(!showLinks) {
      $('.files').slideDown();
      $(e.currentTarget).find('p').text('Hide File Links');
      showLinks = true;
    }
    else {
      $('.files').slideUp();
      $(e.currentTarget).find('p').text('Show File Links');
      showLinks = false;
    }
  });
  //////////////////////////////////////////////////////////
})