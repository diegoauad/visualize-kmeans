/* Script 02 */

/* Control what's being displayed on the grid */

let points = []; // Array of data point objects
let centroids = []; // Array of centroid objects
let painting = false; // Is there user adding data points with the brush tool?
let placingCentroid = false; // Is the user adding a centroid?
let cursor = "crosshair"; // Current cursor when hovering the grid


// list of colors to give to the groups
const centroidColors = [
    "#01c5c4",
    "#b8de6f",
    "#f1e189",
    "#f39233",
    "#f4abc4",
    "#794c74",
    "red"
]

// Generate a random unique ID
const ID = function () {
    return 'd' + Math.random().toString(36).substr(2, 9);
};

// Add dataponts on the grid
const addPoints = function(newPoints) {
    let id = "";

    for(let i = 0; i < newPoints.length; i++) {
        id = ID()
        // Add the DOM element
        $(".grid").append(`<div id = ${id} class = "datapoint" style = "left:${newPoints[i].x - 5}px;top:${newPoints[i].y - 5}px"></div>`)
        // Save a point object on the points array, containing x, y and its DOM id
        points.push({x: newPoints[i].x, y: newPoints[i].y, id: id});
    }

    // Make sure "clear grid" and "add centroids" buttons are enabled
    if(points.length) {
        $("#clear-btn").removeClass("disabled")
        $(".panel * li:first-of-type").addClass("done");
        $(".panel * li:nth-of-type(2)").removeClass("pending");
        $(".panel * li:nth-of-type(2) > .badge").removeClass("disabled");
    }
}

// Initialize the background grid
const addGrid = function() {
    const h = $(window).height() // Grid height
    const w = $(window).width() // Grid width

    const cols = Math.floor( w / 10 ) // number of 10-pixel cols
    const rows = Math.floor( h / 10 ) // number of 10-pixel rows

    const tb = $(".grid tbody")
    let tr = {}

    // Create the grid as a table with tr and td cells.
    for(let i = 0; i < rows; i++) {
        tb.append(`<tr id = ${"r" + i}></tr>`)
        tr = tb.children().last()
        for(let j = 0; j < cols; j++) {
            tr.append(`<td><div></div></td>`)
        }
    }
}

// Add points randomly in an area (used with the brush tool)
const addPointsInArea = function(e) {
    if(brushSize >= 20 && (painting || e.type === "mousedown") && !placingCentroid) {
        painting = true;
        const pointsToCreate = Math.round(brushSize / 20);
        const stepSize = 2 * Math.PI / pointsToCreate;
        const maxDist = brushSize / 2;
        let newPoints = []
        let angle = 0;
        let dist = 0;

        for(let i = 0; i < pointsToCreate; i++) {
            // Randomize polar coords for the new point: angle and distance
            angle = Math.random() * stepSize + (i * stepSize);
            dist = Math.random() * maxDist;
            newPoints.push({x: e.clientX + dist * Math.cos(angle), y: e.clientY + dist * Math.sin(angle)})
        }

        addPoints(newPoints)
    }
}

// Add a new centroid in x, y
const addCentroid = function(x, y) {
    // Can more centroids be added?
    if(centroids.length < 6) {
        const id = "centroid" + ID()
        const color = centroidColors[centroids.length]

        // Create the DOM element with a random ID
        $(".grid").append(`<div id = ${id} class = "centroid" style = "left:${x - 5}px;top:${y - 5}px;background-color:${color}"></div>`)

        // Add the centroid object to the array, with its x, y position, DOM id and color.
        centroids.push({x: x, y: y, id: id, color: color});
    
        // Make sure the buttons for the next step are enabled
        if(centroids.length >= 2) {
            $(".panel * li:nth-of-type(3)").removeClass("pending")
            $("#assignment").removeClass("pending")
            $("#assignment").removeAttr("disabled")
            $(".panel * li:nth-of-type(2)").addClass("done");
        }
    }
}

// Initialize the grid once the page is loaded
$(document).ready(function() {
    addGrid()

    $(window).resize(addGrid)
})

// Handle click on the grid (add datapoints or a centroid)
$(".grid").click(function(e) {
    if(!placingCentroid) {
        if(brushSize < 20) {
            addPoints([{x: e.clientX, y: e.clientY}]);
        }
    } else {
        addCentroid(e.clientX, e.clientY)
    }
})

// Handle usage of the brush tool
$(".grid").mousedown(addPointsInArea);
$(".grid").mousemove(addPointsInArea);

$(".grid").mouseup(function() {
    painting = false
});

