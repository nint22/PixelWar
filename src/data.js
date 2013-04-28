// Just a container of important geometry / game data
// For scenery objects, you must implement a size, sprite size, and geometry array

/*** Friendly Geometry ***/

// Unit component-sprite sizes
var gSpriteWidth = 8;
var gSpriteHeight = 8;

var gFriendlyUnit0 = {
    price: 10,
    stats: {speed: 1, minRange:10, accuracy:0.4, fireRate:0.5},
    size: {width:2, height:4},
    geo: [
        [1,0],
        [1,2],
        [1,0],
        [1,0]
    ]
};

var gFriendlyUnit1 = {
    price: 80,
    stats: {speed: 0.25, minRange:80, accuracy:0.1, fireRate:0.2},
    size: {width:5, height:4},
    geo: [
        [0,0,0,0,1],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [2,2,0,2,2],
    ]
};

/*** Scenery ***/

var sceneryHQ0 = {
    size: {width:10, height:14},
    spriteSize: {width:16, height:16},
    geo: [
        [0,0,0,0,0,3,3,3,3,0],
        [0,0,0,0,3,1,0,0,1,3],
        [0,0,0,0,3,1,1,1,1,3],
        [0,0,0,0,3,1,0,0,1,3],
        [0,0,0,0,3,1,1,1,1,3],
        [0,0,3,3,1,1,0,0,1,3],
        [3,3,1,1,1,1,1,1,1,3],
        [3,1,1,1,1,2,2,2,2,3],
        [3,1,0,1,2,2,2,2,2,3],
        [3,1,0,1,2,2,2,2,2,3],
        [3,1,1,1,2,2,2,2,2,3],
        [3,1,0,1,2,2,2,2,2,3],
        [3,1,0,1,2,2,2,2,2,3],
        [3,1,1,1,2,2,2,2,2,3],
    ]
};

var sceneryHQ1 = {
    size: {width:10, height:14},
    spriteSize: {width:16, height:16},
    geo: [
        [0,3,3,0,0,3,3,3,3,0],
        [0,3,3,0,3,3,3,3,1,3],
        [0,3,3,0,0,0,0,0,3,3],
        [0,3,3,0,0,0,0,0,3,3],
        [0,3,3,0,3,3,3,3,3,3],
        [0,3,3,3,1,1,0,0,1,3],
        [3,3,1,1,1,1,1,1,1,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
        [3,2,2,2,2,2,2,2,2,3],
    ]
};
