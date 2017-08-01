var animatePoints = function(){

    var points = document.getElementsByClassName('point');
    var pLength = points.length;

    var revealPoint = function() {
        for(var i=0; i<pLength; i++){
        points[i].style.opacity = 1;
        points[i].style.transform = "scaleX(1) scaleY(1)";
        points[i].style.msTransform = "scaleX(1) scaleY(1)";
        points[i].style.WebkitTransform = "scaleX(1) scaleY(1)";
        }
    };
    revealPoint();
};
