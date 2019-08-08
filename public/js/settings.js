$(document).ready(function(){

  // SLIDE SHOW FOR LANGUAGES IN PROFILE
  const langs = $(".languages").get(0);
  const scrollDistance = 65;
  const scroller = () => {
    setInterval(() => {
      if( (1.5 * scrollDistance) > ((langs.scrollWidth - langs.offsetWidth) - langs.scrollLeft)) {
        langs.scrollLeft += 2 * scrollDistance;
        if((langs.scrollLeft + langs.offsetWidth) > (langs.scrollWidth - 1)) {
          langs.scrollLeft = 0;
        }
      }
      else { 
        langs.scrollLeft += scrollDistance; 
      }
    }, 1200);
  };
  scroller();


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


  // CANVAS AND AVATAR UPLOAD TO SERVER
  $("#file").change(function(){
    readURL(this);
  });
  // Create new canvas
  const newCanvas = $('<canvas/>',{
      id: 'avatarCanvas'                   
  }).prop({
      width: 200,
      height: 200
    });
  // Put it after image and hide it
  $('#output').after(newCanvas);
  $('#avatarCanvas').css('display', 'none');
  const canvas = $('#avatarCanvas').get(0);
  const ctx = canvas.getContext('2d');
  // New image selected by user
  function readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();   
      reader.readAsDataURL(input.files[0]);
      reader.onload = (event) => {
        // Create new image object and put it into the canvas
        const newImage = new Image();
        newImage.src = event.target.result;       
        newImage.onload = () => {
          $('#output').css('display', 'none');
          $('#avatarCanvas').css('display', 'block');
          $('#avatarCanvas').css('margin', 'auto');
          $('#avatarCanvas').css('border-radius', '50%');
          ctx.drawImage(newImage,0,0,200,200);
        }
      }
    }
  }
});