// Prevent androids soft keyboard change vh unit (!!NOT SURE IF CAUSES ANY BUGS!!)
setTimeout(function () {
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
}, 300);

$(document).ready(function(){
    // Save state of menu in a variable (default is closed)
    var isMenuOpen = false;
    // Execute this when button is clicked
    $("#menu").click(function(){
        if(!isMenuOpen) {
            isMenuOpen = true;
            $(".menu-section").slideDown(200);
        }
        else {
            isMenuOpen = false
            $(".menu-section").slideUp(200);
        }
        
    });
    // Execute this when anywhere is clicked -EXCEPT MENU AND ITS BUTTON- (Close menu)
    $(document).mouseup(function (e) {
        if (!$(".menu-section").is(e.target) && $(".menu-section").has(e.target).length === 0
        && !$("#menu").is(e.target) && $("#menu").has(e.target).length === 0) {
            $(".menu-section").slideUp(200);
            isMenuOpen = false;
        }
    });
});