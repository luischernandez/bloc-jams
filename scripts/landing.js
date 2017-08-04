var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) scaleY(1)";
    point.style.msTransform = "scaleX(1) scaleY(1)";
    point.style.WebkitTransform = "scaleX(1) scaleY(1)";
}

var animatePoints = function(points){
    forEach(points, revealPoint);
};

//window.onload invokes the onload 'event handler' to execute the load 'event'
// on the window 'object'
window.onload = function() {
    if(window.innerHeight > 950) {
        animatePoints(pointsArray);
    }

    var sellingPoints = document.getElementsByClassName('selling-points')[0]; //document.getElementsByClassName will produce an array-like object
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    window.addEventListener('scroll', function(event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    });
}
