$(document).ready(function(){
    // Store the state of login-section (false if closed)
    var loginClicked = false;
    $(".login").click(function(){
        if(!loginClicked) {
            loginClicked = true;
            $(".login-section").slideDown(400);
            $(".login h4").fadeOut(0);
            $(".login img").fadeIn(200);
        }
        else {
            loginClicked = false
            $(".login-section").slideUp(400);
            $(".login img").fadeOut(0);
            $(".login h4").fadeIn(200);
        }
        
    });
    $(".goto-register").click(function(e){
        e.preventDefault();
        $(".username").slideDown(200);
        $(".password-confirm").slideDown(200);
        $(".goto-register").hide();
        $(".goto-login").show();
        $(".forgot").hide();
        $(".bottom input[value=LOGIN]").hide();
        $(".bottom input[value=REGISTER]").show();
    });

    $(".goto-login").click(function(e){
        e.preventDefault();
        $(".username").slideUp(200);
        $(".password-confirm").slideUp(200);
        $(".goto-login").hide();
        $(".goto-register").show();
        $(".forgot").show();
        $(".bottom input[value=LOGIN]").show();
        $(".bottom input[value=REGISTER]").hide();
    });


});

