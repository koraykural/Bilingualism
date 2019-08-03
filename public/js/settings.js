$(document).ready(function(){
  // Save state of menu in a variable (default is closed)
  var isSettingsOpen = false;
  var isBioOpen = false;
  var isLangOpen = false;
  var isPicOpen = false;
  // Execute this when button is clicked
  $(".settingsButton").click(function(){
    if(!isSettingsOpen) {
      isSettingsOpen = true;
      $("#settings").slideDown(300);
    }
    else {
      isSettingsOpen = false
      $("#settings").slideUp(300);
    }
    if(isBioOpen) {
      $("#alter-bio").slideUp(300);
    }
    if(isLangOpen) {
      $("#alter-languages").slideUp(300);
    }
    if(isPicOpen) {
      $("#alter-picture").slideUp(300);
    }
  });

  $("button.bio").click(function() {
    isSettingsOpen = false;
    isBioOpen = true;
    $("#alter-bio").slideDown(300);
    $("#settings").slideUp(300);
  });

  $("button.discard").click(function() {
    isSettingsOpen = true;
    isBioOpen = false;
    isLangOpen = false;
    isPicOpen = false;
    $("#alter-bio").slideUp(300);
    $("#alter-languages").slideUp(300);
    $("#alter-picture").slideUp(300);
    $("#settings").slideDown(300);
  });

  $("#alter-bio").keyup(function(e) {
    if(e.keyCode == '13') {
      $("#alter-bio input[type=submit]").click();
    }
  });

  $("button.lang").click(function() {
    isSettingsOpen = false;
    isLangOpen = true;
    $("#alter-languages").slideDown(300);
    $("#settings").slideUp(300);
  });

  $("button.pic").click(function() {
    isSettingsOpen = false;
    isPicOpen = true;
    $("#alter-picture").slideDown(300);
    $("#settings").slideUp(300);
  });

  $("#file").change(function(){
    readURL(this);
  });
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();   
      reader.onload = function (e) {
        $('#output').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
});