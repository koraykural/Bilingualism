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
topBarText.style.width = '80px';
textQuestion.style.display = 'block';
audioQuestion.style.display = 'none';
imageQuestion.style.display = 'none';

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
    topBarText.style.width = '80px';
    topBarAudio.style.width = '40px';
    topBarImage.style.width = '40px';
    textQuestion.style.display = 'block';
    audioQuestion.style.display = 'none';
    imageQuestion.style.display = 'none';
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
    topBarAudio.style.width = '80px';
    topBarImage.style.width = '40px';
    textQuestion.style.display = 'none';
    audioQuestion.style.display = 'block';
    imageQuestion.style.display = 'none';
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
    topBarImage.style.width = '80px';
    textQuestion.style.display = 'none';
    audioQuestion.style.display = 'none';
    imageQuestion.style.display = 'block';
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
middleBarType.style.width = '120px';
typeAnswer.style.display = 'block';
twoChoiceAnswer.style.display = 'none';
fourChoiceAnswer.style.display = 'none';
checkboxesAnswer.style.display = 'none';

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
    middleBarType.style.width = '120px';
    typeAnswer.style.display = 'block';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'visible';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
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
    middleBarTwoChoice.style.width = '120px';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'block';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'visible';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
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
    middleBarFourChoice.style.width = '120px';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'block';
    checkboxesAnswer.style.display = 'none';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'visible';
    middleBarCheckboxesSelected.style.visibility = 'hidden';
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
    middleBarCheckboxes.style.width = '120px';
    typeAnswer.style.display = 'none';
    twoChoiceAnswer.style.display = 'none';
    fourChoiceAnswer.style.display = 'none';
    checkboxesAnswer.style.display = 'block';
    middleBarTypeSelected.style.visibility = 'hidden';
    middleBarTwoChoiceSelected.style.visibility = 'hidden';
    middleBarFourChoiceSelected.style.visibility = 'hidden';
    middleBarCheckboxesSelected.style.visibility = 'visible';
}