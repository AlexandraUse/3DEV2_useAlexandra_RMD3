var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id;

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var update = function(endX, endY) {
        // Previous position
        var prevX = x,
            prevY = y;

        if(prevX != endX){
            x = endX;
        }

        if(prevY != endY){
            y = endY;
        }

        return (prevX != x || prevY != y) ? true : false;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        update: update
    }
};

module.exports = Player;