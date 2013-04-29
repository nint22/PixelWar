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
    price: 30,
    stats: {speed: 0.6, minRange:12, accuracy:0.2, fireRate:0.3},
    size: {width:3, height:4},
    geo: [
        [0,1,0],
        [2,2,3],
        [2,2,0],
        [0,2,0],
    ]
};

var gFriendlyUnit2 = {
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

var gFriendlyUnit3 = {
    price: 300,
    stats: {speed: 2.1, minRange:400, accuracy:0.5, fireRate:2},
    size: {width:11, height:6},
    geo: [
        [0,0,0,0,3,2,3,2,3,2,3],
        [2,3,2,0,0,0,0,2,0,0,0],
        [0,2,0,0,0,2,2,2,2,2,0],
        [0,0,2,2,2,1,1,1,2,2,2],
        [0,0,0,2,2,1,1,1,1,1,2],
        [0,0,0,0,0,2,2,2,2,2,0],
    ]
};

/*** Enemy Geometry ***/

var gEnemyUnit0 = {
    price: 10,
    stats: {speed: -0.8, minRange:8, accuracy:0.3, fireRate:0.5},
    size: {width:2, height:4},
    geo: [
        [4,6],
        [7,6],
        [4,5],
        [4,5]
    ]
};

var gEnemyUnit1 = {
    price: 30,
    stats: {speed: -0.6, minRange:12, accuracy:0.2, fireRate:0.3},
    size: {width:3, height:4},
    geo: [
        [4,5,4],
        [6,5,5],
        [4,5,5],
        [4,5,5],
    ]
};

var gEnemyUnit2 = {
    price: 80,
    stats: {speed: -0.2, minRange:75, accuracy:0.2, fireRate:0.1},
    size: {width:5, height:4},
    geo: [
        [4,4,4,4,4],
        [6,6,5,5,4],
        [4,5,5,5,4],
        [6,6,6,6,6],
    ]
};

var gEnemyUnit3 = {
    price: 300,
    stats: {speed: -0.1, minRange:400, accuracy:0.5, fireRate:2},
    size: {width:7, height:6},
    geo: [
        [7,6,7,6,7,6,7],
        [4,4,4,5,4,4,4],
        [4,6,6,5,6,6,4],
        [6,4,4,4,4,4,6],
        [6,4,4,4,4,4,6],
        [4,6,6,6,6,6,4],
    ]
};

// Arrays list
var gFriendlyUnits = [ gFriendlyUnit0, gFriendlyUnit1, gFriendlyUnit2, gFriendlyUnit3 ];
var gEnemyUnits = [ gEnemyUnit0, gEnemyUnit1, gEnemyUnit2, gEnemyUnit3 ];

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
        [0,7,7,0,0,7,7,7,7,0],
        [0,7,7,0,7,7,7,7,5,7],
        [0,7,7,0,0,0,0,0,7,7],
        [0,7,7,0,0,0,0,0,7,7],
        [0,7,7,0,7,7,7,7,7,7],
        [0,7,7,7,5,5,0,0,5,7],
        [7,7,5,5,5,5,5,5,5,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
        [7,6,6,6,6,6,6,6,6,7],
    ]
};
