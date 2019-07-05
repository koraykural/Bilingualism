$(document).ready(function(){
    var loginClicked = false;
    $(".login-button button").click(function(){
        if(!loginClicked) {
            loginClicked = true;
            $(".flag").slideUp(200);
            $(".posts").animate({paddingTop: '0px'}, 200);
            $(".login-section").slideDown(400);
            $(".ghost-content").fadeIn(400);
            $(".open-login").fadeOut(200);
            $(".close-login").fadeIn(200);
            //$(".login-button button").animate({bottom: '0'}, 200);
        }
        else {
            loginClicked = false
            $(".flag").slideDown(200);
            $(".posts").animate({paddingTop: '6.25vh'}, 200);
            $(".login-section").slideUp(400);
            $(".ghost-content").fadeOut(400);
            $(".open-login").fadeIn(200);
            $(".close-login").fadeOut(200);
            //$(".login-button button").animate({bottom: '1.56vh'}, 200);
        }
        
    });
    $("#goto-register").click(function(){
        $(".username-section").slideDown(200);
        $(".password-section-2").slideDown(200);
        $("#goto-register").fadeOut(0);
        $("#goto-login").fadeIn(0);
        $("#forgot").fadeOut(0);
        $(".bottom-section input[value=LOGIN]").fadeOut(0);
        $(".bottom-section input[value=REGISTER]").fadeIn(0);
    });

    $("#goto-login").click(function(){
        $(".username-section").slideUp(200);
        $(".password-section-2").slideUp(200);
        $("#goto-login").fadeOut(0);
        $("#goto-register").fadeIn(0);
        $("#forgot").fadeIn(0);
        $(".bottom-section input[value=LOGIN]").fadeIn(0);
        $(".bottom-section input[value=REGISTER]").fadeOut(0);
    });

    $('.login-section input[type=submit]').click(function() {
        window.location='feed.html';
        return false;
      });
});

