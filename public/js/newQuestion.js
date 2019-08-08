// --------------------------------------VISUAL EFFECTS--------------------------------------

// Save class of selected buttons in a variable
// Default selected => (top-bar -> TEXT), (middle-bar -> TYPE)
let classOfSelectedTop = 'text';
let classOfSelectedBottom = 'type';
$(document).ready(function(){
	$(".top-bar ." + classOfSelectedTop).addClass('selected');
	$(".middle-bar ." + classOfSelectedBottom).addClass('selected');
	// Disable selected button
	$(".bar .selected").attr('disabled', true);
	// Hide image for selected
	$(".bar .selected").children('img').animate({
		height: '0',
		width: '0',
		opacity: '0'
	});
	// Set min width in case text is short
	$(".bar .selected").animate({
		minWidth: '140px'
	});
	// Show text for selected
	$(".bar .selected").children('p').animate({
		margin: 'auto 20px',
		fontSize: '1.2em',
		opacity: '1'
	});

	// Show corresponding input areas for selections
	$("." + classOfSelectedTop).slideDown(400);
	$("." + classOfSelectedBottom).slideDown(400);
	$(".answer .selected").css('display', 'flex');
	// This function sets min-height to current height to make height changes
	// more smoothly (Also see CSS transition min-height at .answer and .question)
	setTimeout(function(){
		$(".answer").css('min-height', $(".answer").css('height'));
		$(".question").css('min-height', $(".question").css('height'));
	}, 400);
	// Top Bar Click Event Listener
	$(".top-bar button").click(function(e){
		e.preventDefault();
		// Remove 'disabled' attribute from old selection and add to the new one
		$(".top-bar .selected").attr('disabled', false);
		$(e.currentTarget).attr('disabled', true);
		// Set min-height to make height transition smoother
		$(".question").css('min-height', '55px');
		// Hide text of old selection and show its image
		$(".top-bar .selected").animate({
			minWidth: '45px'
		});     
		$(".top-bar .selected").children('img').animate({
			height: '45px',
			width: '45px',
			opacity: '1'
		});
		$(".top-bar .selected").children('p').animate({
			margin: '0',
			fontSize: '0',
			opacity: '0'
		});
		// Hide image of new selection and show its text
		$(e.currentTarget).animate({
			minWidth: '140px'
		});
		$(e.currentTarget).children('img').animate({
			height: '0',
			width: '0',
			opacity: '0'
		});
		$(e.currentTarget).children('p').animate({
			margin: 'auto 20px',
			fontSize: '1.2em',
			opacity: '1'
		});
		// Set min-height to make height transition smoother
		setTimeout(function(){
			$(".question").css('min-height', $(".question").css('height'));
		}, 400);
		// Hide input area of old selection (Should occur immediatily)
		$(".question ." + classOfSelectedTop).slideUp(0);
		// Save class name of new selection
		classOfSelectedTop =  $(e.currentTarget).attr('class');
		// Show input area of new selection
		$(".question ." + classOfSelectedTop).slideDown(400);
		// Remove class 'selected' from the old selection
		$(".top-bar .selected").removeClass('selected');
		// Add class 'selected' to new selection
		$(e.currentTarget).addClass('selected'); 
		
	});

	// Middle Bar Click Event Listener
	$(".middle-bar button").click(function(e){
		e.preventDefault();
		// Remove 'disabled' attribute from old selection and add to the new one
		$(".middle-bar .selected").attr('disabled', false);
		$(e.currentTarget).attr('disabled', true);
		// Set min-height to make height transition smoother
		$(".answer").css('min-height', '50px');
		// Hide text of old selection and show its image
		$(".middle-bar .selected").animate({
			minWidth: '45px'
		});   
		$(".middle-bar .selected").children('img').animate({
			height: '45px',
			width: '45px',
			opacity: '1'
		});
		$(".middle-bar .selected").children('p').animate({
			margin: '0',
			fontSize: '0',
			opacity: '0'
		});
		// Hide image of new selection and show its text
		$(e.currentTarget).animate({
			minWidth: '140px'
		});
		$(e.currentTarget).children('img').animate({
			height: '0',
			width: '0',
			opacity: '0'
		});
		$(e.currentTarget).children('p').animate({
			margin: 'auto 20px',
			fontSize: '1.2em',
			opacity: '1'
		});
		// Set min-height to make height transition smoother
		setTimeout(function(){
			$(".answer").css('min-height', $(".answer").css('height'));
		}, 400);
		// Hide input area of old selection (Should occur immediatily)
		$(".answer ." + classOfSelectedBottom).slideUp(0);
		// Save class name of new selection
		classOfSelectedBottom =  $(e.currentTarget).attr('class');
		// Show input area of new selection
		$(".answer ." + classOfSelectedBottom).slideDown(400);
		$(".answer ." + classOfSelectedBottom).css('display', 'flex');
		// Remove class 'selected' from the old selection
		$(".middle-bar .selected").removeClass('selected');
		// Add class 'selected' to new selection
		$(e.currentTarget).addClass('selected');
		
		// Remove all 'correct answer checks'
		for(let i = 0; i < 6; i++) {
			$(".answer label > img").attr('src', redCheckSRC);
			$(".answer input[type=checkbox]").val("off");
		}
	});



	// CheckMark for MultiChoice answers
	const redCheckSRC = "./public/images/red-check.svg";
	const greenCheckSRC = "./public/images/green-check.svg";
	$(".answer input[type=checkbox]").change((e) => {
		for(let i = 0; i < 6; i++) {
			$(".answer label > img").attr('src', redCheckSRC);
			$(".answer input[type=checkbox]").val("off");
		}
		const clickedElementId = e.target.id;
		$(".answer label > img#" + clickedElementId).attr('src', greenCheckSRC);
		$(".answer input[type=checkbox]#" + clickedElementId).val("on");
	})




// -----------------------------------AJAX REQUEST-----------------------------------

	// --------------------GET INFO--------------------
	$("#submit").click((e) => {
		// Question => question
		let question = $(".question input.text").val();

		// Answer Type => answerType (type, two-choice, four-choice)
		let middleBarClass = $(".middle-bar .selected").attr('class');
		let answerType = 'type';
		if(middleBarClass.includes('type')) {answerType = 'type'}
		if(middleBarClass.includes('two-choice')) {answerType = 'two-choice'}
		if(middleBarClass.includes('four-choice')) {answerType = 'four-choice'}

		// Answers => answers[0,1](two-choice), answers[0,1,2,3](four-choice)
		let answers = [];
		if(answerType != 'type') {
			let childs = $(".answer ." + answerType).children(0).children('input[type=text]');
			for(let i = 0; i < childs.length; i++) {
				answers[i] = childs[i].value;
			}
		}

		// Correct Answer => correctAnswer two-choice(1,2), four-choice(1,2,3,4)
		let correctAnswer = 0;
		correctAnswer = $(".answer input[type=checkbox][value=on]").attr('id');
		if(correctAnswer) {
			correctAnswer = correctAnswer.charAt(5);
		}

		// ----------VALIDATION AND ERROR MESSAGE----------
		const errorP = $("#new .error");
		// Validate question
		question = question.trim();
		if(question == '' || question == undefined) {
			errorP.text('Question field is empty!');
		} else {
			errorP.text('');
		}

		// Validate Answers 'two-choice'
		if(answerType == 'two-choice') {
			answers.forEach((answer) => {
				answer.trim();
			});
			if(correctAnswer > 2 || correctAnswer < 1 || correctAnswer == undefined) {
				errorP.text('Choose the correct answer!');
			}
			if(!answers[0] || !answers[1]) {
				errorP.text('Answer fields are empty!')
			}
		} 
		// Validate Answers 'four-choice'
		else if(answerType == 'four-choice') {
			answers.forEach((answer) => {
				answer.trim();
			});
			if(correctAnswer) {
				correctAnswer -= 2; // correct answers (3,4,5,6) => (1,2,3,4)
			}
			if(correctAnswer > 4 || correctAnswer < 1 || correctAnswer == undefined) {
				errorP.text('Choose the correct answer!');
			}
			if(!answers[0] || !answers[1] || !answers[2] || !answers[3] ) {
				errorP.text('Answer fields are empty!')
			}
		}	
		

		// Ajax Request
		let readyToSend = !(errorP.text());
		if(readyToSend) {
			$.ajax({
				type: "POST",
				url: '/newQuestion',
				data: {
					question: question,
					answerType: answerType,
					answers: answers,
					correctAnswer: correctAnswer,
				},
				success: (response) => {
					// Show error if server sends any, else reload page
					if(response) {
						errorP.text(response);
					}
					else {
						location.reload(true);
					}
				}
			}, errorP.text('Hang on...'));
		}



	});




});

