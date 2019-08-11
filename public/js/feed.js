$(document).ready(() => {

  // SEND ANSWER 'Type'
  const answeringTypeQuestions = (e) => {
    const answerType = 'type';
    const questionID = $(e.currentTarget.parentElement.parentElement.parentElement).attr('id').substr(1);
    // Get written answer
    const userAnswer = $(e.target.parentElement.previousSibling).val();
    // Send Ajax

  };

  // SEND ANSWER 'Multi'
  const answeringMultiQuestions = (e) => {
    const answerType = 'multi';
    const questionID = $(e.currentTarget.parentElement.parentElement.parentElement).attr('id').substr(1);
    // If choice is not selected before select it (double click to take it as answer)
    if(!$(e.currentTarget).hasClass('orange')) {
      $(e.currentTarget).siblings().removeClass('orange');
      $(e.currentTarget).addClass('orange');
    }
    else {
      const userAnswer = $(e.currentTarget).attr('id').substr(1);
    // Send Ajax

    }
  };

  // Send request to the server to get more questions
  const requestQuestions = () => {
    if($(window).scrollTop() + $(window).height() +1 >= $('content').offset().top + $('content').height() && !$(window).data('ajax_in_progress')) {
      // Prevent it from sending more requests
      $(window).data('ajax_in_progress', true);
      $.ajax({
        type: 'POST',
        url: '/sendQuestion',
        dataType: 'json',
        success: (response) => { // Array of obj
          renderQuestions(response);
          // Add Listeners to newly added elements
          $(".answers .multi button").click(answeringMultiQuestions);
          $(".answers button.submit").click(answeringTypeQuestions);
          $(".post .votes button").click(voteQuestion);
        }
      });
    }
  };

  // Render questions sent from server
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
        $('content').append(template);
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
        $('content').append(template);

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
        $('content').append(template);
      }
    });
    // Make it ready to send more question request
    $(window).data('ajax_in_progress', false);
  };

  const voteQuestion = (e) => {
    let currentVote = parseInt($(e.currentTarget).find('p').text());
    currentVote += 1;
    $(e.currentTarget).find('p').text(currentVote);
    // vote (up, down)
    const vote = $(e.currentTarget).attr('class');
    const questionID = $(e.currentTarget.parentElement.parentElement.parentElement).attr('id').substr(1);
    // Send Ajax
  };
  
  // ------------------------GET QUESTION------------------------
  $(window).data('ajax_in_progress', false);
  requestQuestions();
  $(window).scroll(requestQuestions);





  // ------------------------SHOW COMMENTS-----------------------



  // ------------------------VOTE QUESTION-----------------------
  $(".post .votes button").click(voteQuestion);

})