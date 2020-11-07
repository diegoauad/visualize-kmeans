/* Script 04 */

/* Control status of the control panel */

let brushSize = 0; // Select brush radius (0-100)
let pointsWithCentroids = []

// Initialize brush size on the smallest value
$("#brushRange").val(0)

// Handle brush size change (range slider)
$("#brushRange").on('input change', function(e) {
    const val = $("#brushRange").val()

    // Re-adjust input value to something between 19-100, 19 being the crosshair
    brushSize = 19 + Math.round(81 * val / 100)
    
    if(brushSize === 19) {
        // Preview crosshair
        $(".brush-preview").remove()
        $("#brush-selection").append(`<img class = "brush-preview" src="images/crosshair.png"></img>`)
    } else {
        // Preview a circle
        $("img.brush-preview").remove();
        if($("div.brush-preview").length) {
            $(".brush-preview").css({'width': `${brushSize}px`, 'height': `${brushSize}px`})
        } else {
            $("#brush-selection").append(`<div class = "brush-preview" style = "width:${brushSize}px;height:${brushSize}px"></div>`)
        }
    }
})

// Reduction sum function
function sum(x, y) {
    return x + y;
}

// Update grid cursor after brush size change
$("#brush-selection").mouseleave(function(e) {
    $(".brush-preview").remove();
    cursor = brushSize < 20 ? 'crosshair' : `url(images/cursor-${brushSize}_x_${brushSize}.png) ${brushSize / 2} ${brushSize / 2}, crosshair`
})

$(".grid").hover(function(e) {
    $(this).css("cursor", cursor);
})
// -------

// Handle "clear grid" button click
$("#clear-btn").click(function() {
    points = []; // Reset datapoints
    centroids = []; // Reset centroids
    placingCentroid = false; // Disable centroid-placing mode
    $(".datapoint").remove(); // Remove all datapoints from DOM
    $(".centroid").remove(); // Remove all centroids from DOM
    $("#clear-btn").addClass("disabled"); // Disable "clear grid" btn
    $(".panel * li:nth-of-type(1)").removeClass("done"); // Remove "done" from all steps
    $(".panel * li:nth-of-type(2)").addClass("pending"); // Remove "done" from all steps
    $(".panel * li:nth-of-type(2) > .badge").removeClass("disabled"); // Remove "done" from all steps
    $(".panel * li:nth-of-type(3)").addClass("pending"); // Remove "done" from all steps
    $(".panel * li:nth-of-type(3)").removeClass("done"); // Remove "done" from all steps
    $(".panel .btn-outline-secondary").addClass("pending"); // Remove "done" from all steps
    $(".panel .btn-outline-secondary").attr("disabled", true);
    $("#calculate").addClass("disabled"); // Disabel calculation buttons
    $("#convergence").addClass(["pending", "fail"]);
    $("#convergence").removeClass("done");
})

// Handle "add centroid" button click
$("#centroid-add").click(function() {
    placingCentroid = true;
    cursor = "crosshair"
})

// Handle "Assign to centroids" button click
$("#assignment").click(function() {
    pointsWithCentroids = assignToCentroid(points, centroids, 1);
    cursor = "crosshair"
    placingCentroid = false
    painting = false
})

// Handle "Relocate centroids" button click
$("#relocation").click(function() {

    $("#convergence").removeClass("pending")

    newCentroids = relocateCentroids(pointsWithCentroids, centroids)
    centroids = newCentroids.new

    if(newCentroids.converged) {
        $("#convergence").addClass("done")
        $("#convergence").removeClass("fail")
        $("#convergence").html("Converged!")
        $(".panel * li:nth-of-type(3)").addClass("done");
    } else {
        $("#assignment").removeAttr("disabled")
        $("#assignment").removeClass("pending")
    }

    $("#relocation").prop("disabled", true)
    $("#relocation").addClass("pending")
})