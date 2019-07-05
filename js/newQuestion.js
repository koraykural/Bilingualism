// Save class of selected buttons in a variable
// Default selected => (top-bar -> TEXT), (middle-bar -> TYPE)
let classOFSelectedTop = 'text';
let classOFSelectedBottom = 'type';
$(document).ready(function(){
    $(".top-bar ." + classOFSelectedTop).addClass('selected');
    $(".middle-bar ." + classOFSelectedBottom).addClass('selected');
    // Disable selected button
    $(".bar .selected").attr('disabled', true);
    // Hide image for selected
    $(".bar .selected").children('img').animate({
        height: '0',
        opacity: '0'
    });
    // Show text for selected
    $(".bar .selected").children('h3').animate({
        margin: 'auto 5vw',
        fontSize: '1em',
        opacity: '1'
    });
    // Set min width in case text is short
    $(".bar .selected").animate({
        minWidth: '22vw'
    });
    // Show corresponding input areas for selections
    $("." + classOFSelectedTop).slideDown(400);
    $("." + classOFSelectedBottom).slideDown(400);
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
            minWidth: '0'
        });     
        $(".top-bar .selected").children('img').animate({
            height: '45px',
            opacity: '1'
        });
        $(".top-bar .selected").children('h3').animate({
            margin: '0',
            fontSize: '0',
            opacity: '0'
        });
        // Hide image of new selection and show its text
        $(e.currentTarget).animate({
            minWidth: '22vw'
        });
        $(e.currentTarget).children('img').animate({
            height: '0',
            opacity: '0'
        });
        $(e.currentTarget).children('h3').animate({
            margin: 'auto 5vw',
            fontSize: '1em',
            opacity: '1'
        });
        // Set min-height to make height transition smoother
        setTimeout(function(){
            $(".question").css('min-height', $(".question").css('height'));
        }, 400);
        // Hide input area of old selection (Should occur immediatily)
        $(".question ." + classOFSelectedTop).slideUp(0);
        // Save class name of new selection
        classOFSelectedTop =  $(e.currentTarget).attr('class');
        // Show input area of new selection
        $(".question ." + classOFSelectedTop).slideDown(400);
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
            minWidth: '0'
        });   
        $(".middle-bar .selected").children('img').animate({
            height: '45px',
            opacity: '1'
        });
        $(".middle-bar .selected").children('h3').animate({
            margin: '0',
            fontSize: '0',
            opacity: '0'
        });
        // Hide image of new selection and show its text
        $(e.currentTarget).animate({
            minWidth: '22vw'
        });
        $(e.currentTarget).children('img').animate({
            height: '0',
            opacity: '0'
        });
        $(e.currentTarget).children('h3').animate({
            margin: 'auto 5vw',
            fontSize: '1em',
            opacity: '1'
        });
        // Set min-height to make height transition smoother
        setTimeout(function(){
            $(".answer").css('min-height', $(".answer").css('height'));
        }, 400);
        // Hide input area of old selection (Should occur immediatily)
        $(".answer ." + classOFSelectedBottom).slideUp(0);
        // Save class name of new selection
        classOFSelectedBottom =  $(e.currentTarget).attr('class');
        // Show input area of new selection
        $(".answer ." + classOFSelectedBottom).slideDown(400);
        $(".answer ." + classOFSelectedBottom).css('display', 'flex');
        // Remove class 'selected' from the old selection
        $(".middle-bar .selected").removeClass('selected');
        // Add class 'selected' to new selection
        $(e.currentTarget).addClass('selected');
        
    });
});

















/*
// Top Bar Events

// Reaching necessary dom elements and storing them in variables
const textQuestion = document.getElementById('text-question');
const audioQuestion = document.getElementById('audio-question');
const imageQuestion = document.getElementById('image-question');
const topBarText = document.querySelector('.top-bar .text');
const topBarAudio = document.querySelector('.top-bar .audio');
const topBarImage = document.querySelector('.top-bar .image');
const topBarTextSelected = topBarText.querySelector('#selected');
const topBarAudioSelected = topBarAudio.querySelector('#selected');
const topBarImageSelected = topBarImage.querySelector('#selected');

// Adding Listeners
topBarText.addEventListener('click', topBarTextFunc);
topBarAudio.addEventListener('click', topBarAudioFunc);
topBarImage.addEventListener('click', topBarImageFunc);

// Default selection for top bar button 'text' 
topBarText.style.boxShadow= '1px 1px 3px 0px rgba(0,0,0,0.3)';
topBarAudio.style.backgroundImage = "url('../images/create-question-audio.png')";
topBarImage.style.backgroundImage = "url('../images/create-question-image.png')";
topBarText.style.backgroundImage = "none";
topBarTextSelected.style.visibility = 'visible';
topBarText.style.width = 'fit-content';
textQuestion.style.display = 'block';
audioQuestion.style.display = 'none';
imageQuestion.style.display = 'none';
topBarText.style.fontSize = '1em';

// Functions for top bar events
function topBarTextFunc(e) {
    e.preventDefault();
    topBarText.style.backgroundImage = "none";
    topBarAudio.style.backgroundImage = "url('../images/create-question-audio.png')";
    topBarImage.style.backgroundImage = "url('../images/create-question-image.png')";
    topBarText.style.boxShadow= '1px 1px 3px 0px rgba(0,0,0,0.3)';
    topBarAudio.style.boxShadow= 'none';
    topBarImage.style.boxShadow= 'none';
    topBarTextSelected.style.visibility = 'visible';
    topBarAudioSelected.style.visibility = 'hidden';
    topBarImageSelected.style.visibility = 'hidden';
    topBarText.style.width = 'fit-content';
    topBarAudio.style.width = '40px';
    topBarImage.style.width = '40px';
    textQuestion.style.display = 'block';
    audioQuestion.style.display = 'none';
    imageQuestion.style.display = 'none';
    topBarText.style.fontSize = '1em';
    topBarAudio.style.fontSize = '0.2em';
    topBarImage.style.fontSize = '0.2em';
}

function topBarAudioFunc(e) {
    e.preventDefault();
    topBarText.style.backgroundImage = "url('../images/create-question-text.png')";
    topBarAudio.style.backgroundImage = "none";
    topBarImage.style.backgroundImage = "url('../images/create-question-image.png')";
    topBarText.style.boxShadow= 'none';
    topBarAudio.style.boxShadow= '1px 1px 3px 0px rgba(0,0,0,0.3)';
    topBarImage.style.boxShadow= 'none';
    topBarTextSelected.style.visibility = 'hidden';
    topBarAudioSelected.style.visibility = 'visible';
    topBarImageSelected.style.visibility = 'hidden';
    topBarText.style.width = '40px';
    topBarAudio.style.width = 'fit-content';
    topBarImage.style.width = '40px';
    textQuestion.style.display = 'none';
    audioQuestion.style.display = 'block';
    imageQuestion.style.display = 'none';
    topBarText.style.fontSize = '0.2em';
    topBarAudio.style.fontSize = '1em';
    topBarImage.style.fontSize = '0.2em';
}

function topBarImageFunc(e) {
    e.preventDefault();
    topBarText.style.backgroundImage = "url('../images/create-question-text.png')";
    topBarAudio.style.backgroundImage = "url('../images/create-question-audio.png')";
    topBarImage.style.backgroundImage = "none";
    topBarText.style.boxShadow= 'none';
    topBarAudio.style.boxShadow= 'none';
    topBarImage.style.boxShadow= '1px 1px 3px 0px rgba(0,0,0,0.3)';
    topBarTextSelected.style.visibility = 'hidden';
    topBarAudioSelected.style.visibility = 'hidden';
    topBarImageSelected.style.visibility = 'visible';
    topBarText.style.width = '40px';
    topBarAudio.style.width = '40px';
    topBarImage.style.width = 'fit-content';
    textQuestion.style.display = 'none';
    audioQuestion.style.display = 'none';
    imageQuestion.style.display = 'block';
    topBarText.style.fontSize = '0.2em';
    topBarAudio.style.fontSize = '0.2em';
    topBarImage.style.fontSize = '1em';
}
//////////////////////////////////////////////////////////////////////////

// Middle Bar Events

// Reaching necessary dom elements and storing them in variables
const middleBarType = document.querySelector('.middle-bar .type');
const middleBarTwoChoice = document.querySelector('.middle-bar .two-choice');
const middleBarFourChoice = document.querySelector('.middle-bar .four-choice');
const middleBarCheckboxes = document.querySelector('.middle-bar .checkboxes');
const typeAnswer = document.getElementById('type-answer');
const twoChoiceAnswer = document.getElementById('two-choice-answer');
const fourChoiceAnswer = document.getElementById('four-choice-answer');
const checkboxesAnswer = document.getElementById('checkboxes-answer');
const middleBarTypeSelected = middleBarType.querySelector('#selected');
const middleBarTwoChoiceSelected = middleBarTwoChoice.querySelector('#selected');
const middleBarFourChoiceSelected = middleBarFourChoice.querySelector('#selected');
const middleBarCheckboxesSelected = middleBarCheckboxes.querySelector('#selected');

// Adding Listeners
middleBarType.addEventListener('click', middleBarTypeFunc);
middleBarTwoChoice.addEventListener('click', middleBarTwoChoiceFunc);
middleBarFourChoice.addEventListener('click', middleBarFourChoiceFunc);
middleBarCheckboxes.addEventListener('click', middleBarCheckboxesFunc);

// Default selection for middle bar button 'type' 
middleBarType.style.boxShadow= '1px 1px 3px 0px rgba(0,0,0,0.3)';
middleBarType.style.backgroundImage = 'none';
middleBarTwoChoice.style.backgroundImage = "url('../images/create-question-multi-2.png')"
middleBarFourChoice.style.backgroundImage = "url('../images/create-question-multi-4.png')"
middleBarCheckboxes.style.backgroundImage = "url('../images/create-question-checkboxes.png')"
middleBarTypeSelected.style.visibility = 'visible';
middleBarType.style.width = 'fit-content';
typeAnswer.style.display = 'block';
twoChoiceAnswer.style.display = 'none';
fourChoiceAnswer.style.display = 'none';
checkboxesAnswer.style.display = 'none';
middleBarType.style.fontSize = '1em';


function middleBarTypeFunc(e) {
    e.preventDefault();
    middleBarType.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.3)';
    middleBarTwoChoice.style.boxShadow = 'none';
    middleBarFourChoice.style.boxShadow = 'none';
    middleBarCheckboxes.style.boxShadow = 'none';
    middleBarType.style.backgroundImage = 'none';
    middleBarTwoChoice.style.backgroundImage = "url('../images/create-question-multi-2.png')";
    middleBarFourChoice.style.backgroundImage = "url('../images/create-question-multi-4.png')";
    middleBarCheckboxes.style.backgroundImage = "url('../images/create-question-checkboxes.png')";
    middleBarTwoChoice.style.width = '40px';
    middleBarFourChoice.style.width = '40px';
    middleBarCheckboxes.style.width = '40px';
    middleBarType.style.width = 'fit-content';
    typeAnswer.style.display = 'block';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'visible';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
    middleBarType.style.fontSize = '1em';
    middleBarTwoChoice.style.fontSize = '0.2em';
    middleBarFourChoice.style.fontSize = '0.2em';
    middleBarCheckboxes.style.fontSize = '0.2em';
}

function middleBarTwoChoiceFunc(e) {
    e.preventDefault();
    middleBarType.style.boxShadow = 'none';
    middleBarTwoChoice.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.3)';
    middleBarFourChoice.style.boxShadow = 'none';
    middleBarCheckboxes.style.boxShadow = 'none';
    middleBarType.style.backgroundImage = "url('../images/create-question-type.png')";
    middleBarTwoChoice.style.backgroundImage = 'none';
    middleBarFourChoice.style.backgroundImage = "url('../images/create-question-multi-4.png')";
    middleBarCheckboxes.style.backgroundImage = "url('../images/create-question-checkboxes.png')";
    middleBarType.style.width = '40px';
    middleBarFourChoice.style.width = '40px';
    middleBarCheckboxes.style.width = '40px';
    middleBarTwoChoice.style.width = 'fit-content';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'block';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'visible';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
    middleBarType.style.fontSize = '0.2em';
    middleBarTwoChoice.style.fontSize = '1em';
    middleBarFourChoice.style.fontSize = '0.2em';
    middleBarCheckboxes.style.fontSize = '0.2em';
}

function middleBarFourChoiceFunc(e) {
    e.preventDefault();
    middleBarType.style.boxShadow = 'none';
    middleBarTwoChoice.style.boxShadow = 'none';
    middleBarFourChoice.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.3)';
    middleBarCheckboxes.style.boxShadow = 'none';
    middleBarType.style.backgroundImage = "url('../images/create-question-type.png')";
    middleBarTwoChoice.style.backgroundImage = "url('../images/create-question-multi-2.png')";
    middleBarFourChoice.style.backgroundImage = 'none';
    middleBarCheckboxes.style.backgroundImage = "url('../images/create-question-checkboxes.png')";
    middleBarType.style.width = '40px';
    middleBarTwoChoice.style.width = '40px';
    middleBarCheckboxes.style.width = '40px';
    middleBarFourChoice.style.width = 'fit-content';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'block';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'visible';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
    middleBarType.style.fontSize = '0.2em';
    middleBarTwoChoice.style.fontSize = '0.2em';
    middleBarFourChoice.style.fontSize = '1em';
    middleBarCheckboxes.style.fontSize = '0.2em';
}

function middleBarCheckboxesFunc(e) {
    e.preventDefault();
    middleBarType.style.boxShadow = 'none';
    middleBarTwoChoice.style.boxShadow = 'none';
    middleBarFourChoice.style.boxShadow = 'none';
    middleBarCheckboxes.style.boxShadow = '1px 1px 3px 0px rgba(0,0,0,0.3)';
    middleBarType.style.backgroundImage = "url('../images/create-question-type.png')";
    middleBarTwoChoice.style.backgroundImage = "url('../images/create-question-multi-2.png')";
    middleBarFourChoice.style.backgroundImage = "url('../images/create-question-multi-4.png')";
    middleBarCheckboxes.style.backgroundImage = 'none';
    middleBarType.style.width = '40px';
    middleBarTwoChoice.style.width = '40px';
    middleBarFourChoice.style.width = '40px';
    middleBarCheckboxes.style.width = 'fit-content';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'block';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'visible';
    middleBarType.style.fontSize = '0.2em';
    middleBarTwoChoice.style.fontSize = '0.2em';
    middleBarFourChoice.style.fontSize = '0.2em';
    middleBarCheckboxes.style.fontSize = '1em';
}

*/