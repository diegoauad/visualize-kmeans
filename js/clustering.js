/* Script 01 */

/* Contains all functions necessary for clustering */

/* Delay in seconds for animations (centroid moving, circles around data points) */
const delay = 2

/* Given x, y and an array of Centroid objects, find the closest centroid to x, y */
function findClosestCentroid(x, y, centroids) {
    let minDistance = 9e99
    let nearestId = -1

    for(let i = 0; i < centroids.length; i++) {
        const c = centroids[i]
        const dist = Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2)
        if(dist < minDistance) {
            nearestId = i
            minDistance = dist
        }
    }

    /* Return:
    An object with:
    - Nearest centroid object
    - Nearest centroid index in centroids array
    - Distance from x, y to the nearest centroid
    */
    return {centroid: centroids[nearestId], id: nearestId, distance: Math.pow(minDistance, 0.5)}
}

/* Iterate datapoints and assign them their nearest centroid */
function assignToCentroid(datapoints, centroids) {

    // Array to store result
    let pointsNearest = []

    for(let i = 0; i < datapoints.length; i++) {
        let datapoint = datapoints[i]

        // Find nearest centroid to this datapoint
        let nearestCentroid = findClosestCentroid(datapoint.x, datapoint.y, centroids)

        let id = ID()
        // Create a circle around the datapoint
        $(".grid").append(`<div id = ${id} class = "distance-circle" style = "left: ${datapoint.x}px; top: ${datapoint.y}px; border-color: ${nearestCentroid.centroid.color}; transition: width ${delay}s, height ${delay}s;"></div>`)
        
        // Modify circle CSS to start transition
        setTimeout(function(id, nearest) { 
            $("#" + id).css({"width": nearestCentroid.distance * 2.05 + "px", "height": nearestCentroid.distance * 2.05 + "px"})
         }, 100, id, nearestCentroid);

        // Remove circle and change datapoint color when transition is over
        setTimeout(function(id, datapoint, nearestCentroid) { 
            $("#" + id).remove()
            $("#" + datapoint.id).css({"background-color": nearestCentroid.centroid.color})
            $("#relocation").removeAttr("disabled")
            $("#relocation").removeClass("pending")
            $("#assignment").prop("disabled", true)
            $("#assignment").addClass("pending")
         }, delay * 1000 + 100, id, datapoint, nearestCentroid);

        datapoint.nearest = nearestCentroid.id
        pointsNearest.push(datapoint)
    }

    return(pointsNearest)
}

// Reduction sum function
function sum(x, y) {
    return x + y;
}

/* Move a particular centroid to its new position */
function moveCentroid(centroids, i, x, y) {
    let thisCentroid = centroids[i]
    let id = ID()

    /* Polar coordinates (to draw the arrow) */
    const dist = Math.pow(Math.pow(x - thisCentroid.x, 2) + Math.pow(y - thisCentroid.y, 2), 0.5);
    let angle = Math.atan((y - thisCentroid.y) / (x - thisCentroid.x))

    if(x < thisCentroid.x) {
        angle += Math.PI
    }

    /* Only animate it if the distance is large enough */
    if(dist > 20) {
        $('.grid').append(`<span id = ${id} class="arrow" style = "left: ${thisCentroid.x}px;top: ${thisCentroid.y - 7}px; transform: rotateZ(${angle}rad);"></span>`)
        $('head').append(`<style id = ${"style" + id}>#${id}:before { width: ${dist}px; background: ${thisCentroid.color}; } #${id}:after { border-left: 8px solid ${thisCentroid.color}; } </style>`)
    }
    
    /* Modify centroid and arrow CSS properties and start transition */
    setTimeout(function(id, thisCentroid, dist) {
        if(dist > 20) {
            $("#" + id).css({"left": x + "px", "top": y - 7 + "px"})
            $("#style" + id).html(`#${id}:before { width: 0; background: ${thisCentroid.color}; } #${id}:after { border-left: 8px solid ${thisCentroid.color}; }`)
        }
        $("#" + thisCentroid.id).css({"left": x + "px", "top": y + "px"})
    }, 100, id, thisCentroid, dist)

    /* When transition is over, remove the arrow */
    if(dist > 20) {
        setTimeout(function(id) {
            $("#" + id).remove()
            $("#style" + id).remove()
        }, delay * 1250, id)
    }

    thisCentroid.x = x
    thisCentroid.y = y
    centroids[i] = thisCentroid
    return(centroids)
}

/* Compare point and centroid positions and relocate centroids */
function relocateCentroids(points, centroids) {
    let converged = true // Did all of the centroids stay in the same place?
    let nearestPoints = [] // Array containing the points for which i is the nearest centroid
    let xPositions = [] // Array containing x positions of nearestPoints
    let yPositions = [] // Array containing y positions of nearestPoints

    // For each centroid...
    for(let i = 0; i < centroids.length; i++) {
        // Get the points in its group...
        nearestPoints = points.filter(p => p.nearest === i)
        let thisCentroid = centroids[i]

        // if there are more than 0 points...
        if(nearestPoints.length > 0) {
            // Get their positions
            xPositions = nearestPoints.map(p => p.x)
            yPositions = nearestPoints.map(p => p.y)

            // and use them to calculate the average
            x = xPositions.reduce(sum) / xPositions.length
            y = yPositions.reduce(sum) / yPositions.length

            // Has centroid position changed?
            if(thisCentroid.x !== x || thisCentroid.y !== y) {
                converged = false
                centroids = moveCentroid(centroids, i, x, y)
            }
        }
    }

    // Return the new centroid positions and a convergence flag
    return {new: centroids, converged: converged}
}