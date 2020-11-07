/* Script 03 */

/* Makes the control panel draggable */

/* Handles mouse down on the panel top handle */
$(".drag-zone").on("mousedown", function(e) {
    var lastMousePos = {x: e.clientX, y: e.clientY}

    $(".drag-zone").addClass("dragging");
    
    /* Start listening for mouse move and move the panel with it */
    $(window).on("mousemove", function(e2) {
        const left = parseInt($(".panel").css("left").replace('px', ''), 10)
        const top = parseInt($(".panel").css("top").replace('px', ''), 10)

        $(".panel").css({"left": left + (e2.clientX - lastMousePos.x), "top": top + (e2.clientY - lastMousePos.y)})

        lastMousePos = {x: e2.clientX, y: e2.clientY}
    })

    e.preventDefault()
})

/* Stop dragging */
$(window).on("mouseup", function(e) {
    $(window).off("mousemove");
    $(".drag-zone").removeClass("dragging");
})