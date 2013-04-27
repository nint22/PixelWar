
/*** Important Globals ***/

var gWindowWidth = 1000;
var gWindowHeight = 500;
var gColorPalette = ['#EFFFDE', '#ADD794', '#529273', '#183442'];

/*** Friendly Geometry ***/

var gFriendlyUnit0 = {
    price: 10,
    stats: {minRange:10, accuracy:0.4, fireRate:0.5},
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
    stats: {minRange:80, accuracy:0.1, fireRate:0.2},
    size: {width:5, height:3},
    geo: [
        [0,1,0,0,0],
        [1,1,1,1,0],
        [1,1,0,1,1],
    ]
};

/*** World Geometry ***/

// Programatically generated
var gWorldPolygon = []; //[[0, 350], [10, 400], [50, 410], [100, 405], [200, 380], [250, 395], [250, 350]];

/*** Player Properties ***/

gPlayerBank: 0;

/*** CraftyJS Support Code ***/

function Game_Load()
{
    // Generate our world geometry (simple sum-series of sin functions)
    var pointCount = 100;
    var pointSpread = 32;
    var offset = 22.0; // Change this to get a different "seeded" pattern
    for(var i = 0; i < pointCount; i++)
    {
        // Pro-tip: This sin func. is totally hand-made and doesn't actually mean anything; I kept fudging the numbers
        // until we had a cool looking scene!
        var x = i * pointSpread;
        var y = gWindowHeight - pointSpread * 2 +
           10.0 * Math.sin(offset + i) +
           10.0 * Math.sin(offset + i * 100) +
           5.0 * Math.cos( offset + parseFloat(i) / 100.0) +
           5.0 * Math.cos( offset + 100.0 * Math.random() );
        gWorldPolygon.push([x, y]);
    }
    
    // Define how we are drawn...
    Crafty.c("GameUnit", {
        _unit: {},
        _pos: [0, 0],
        
        initialize: function(unit, pos){
            this._pos = pos;
            
            // Deep copy unit
            this._unit.price = unit.price;
            this._unit.stats = {minRange:unit.stats.minRange, accuracy:unit.stats.accuracy, fireRate:unit.stats.fireRate};
            this._unit.size = {width:unit.size.width, height:unit.size.height};
            this._unit.geo = unit.geo;
            
            // Unit component-sprite sizes
            var spriteWidth = 8;
            var spriteHeight = 8;
            
            // Generate all relavent sprites
            for(var y = 0; y < this._unit.size.height; y++)
            for(var x = 0; x < this._unit.size.width; x++)
            {
                var colorIndex = this._unit.geo[y][x];
                Crafty.e("2D, Canvas, Color").color( gColorPalette[colorIndex] ).attr({x: pos[0] + x * spriteWidth, y: pos[1] + y * spriteHeight, w: spriteWidth, h: spriteHeight});
            }
            
            // Register for future updates
            this.bind("EnterFrame",function(){
                this.draw();
            })
        },
        
        draw: function(){
            
        }
    });
    
    // Define how the world is drawn..
    Crafty.c("GameBackground", {
    
        gKeyState: {},
        points: [],
        
        initialize: function( givenPoints ){
            // Args
            this.points = givenPoints;
            
            // Key down events
            this.requires('Keyboard').bind('KeyDown', function () {
                if(this.isDown('LEFT_ARROW'))
                    this.gKeyState['LEFT_ARROW'] = true;
                if(this.isDown('RIGHT_ARROW'))
                    this.gKeyState['RIGHT_ARROW'] = true;
            });
            this.requires('Keyboard').bind('KeyUp', function () {
                if(!this.isDown('LEFT_ARROW'))
                    this.gKeyState['LEFT_ARROW'] = false;
                if(!this.isDown('RIGHT_ARROW'))
                    this.gKeyState['RIGHT_ARROW'] = false;
            });
            
            // Create all initial entities..
            var len = this.points.length;
            for(var i = 1; i < len - 1; i++)
            {
                var prev = this.points[i - 1];
                var pt = this.points[i];
                var next = this.points[i + 1];
                
                // Left-length and right-length
                var leftLength = Math.abs(prev[0] - pt[0]) / 2.0;
                var rightLength = Math.abs(next[0] - pt[0]) / 2.0;
                
                var leftHeight = (prev[1] - pt[1]) / 4.0;
                var rightHeight = (next[1] - pt[1]) / 4.0;
                
                // Draw with depth..
                var stepHeight = 16;
                for(var y = 0; y < 3; y++)
                {
                    // No need to retain (draw left and right)
                    var spriteHeight = (y == 2) ? 100.0: stepHeight;
                    Crafty.e("2D, Canvas, Color").color( gColorPalette[y + 1] ).attr({x: pt[0] - leftLength, y: pt[1] + y * stepHeight + leftHeight, w: leftLength, h: spriteHeight});
                    Crafty.e("2D, Canvas, Color").color( gColorPalette[y + 1] ).attr({x: pt[0], y: pt[1] + y * stepHeight + rightHeight, w: rightLength, h: spriteHeight});
                    
                    // Debugging:
                    //Crafty.e("2D, Canvas, Color").color("red").attr({x: pt[0], y: pt[1], w: 4, h: 4});
                }
            }
            
            // Register for callback
            this.bind("EnterFrame",function(){
                this.update();
            })
        },
        
        update: function(){
            
            // Camera movement based on key events
            var moveSpeed = 8;
            if( this.gKeyState['LEFT_ARROW'] != undefined && this.gKeyState['LEFT_ARROW'] == true )
                Crafty.viewport.scroll('_x', Crafty.viewport.x + moveSpeed);
            if( this.gKeyState['RIGHT_ARROW'] != undefined && this.gKeyState['RIGHT_ARROW'] == true )
                Crafty.viewport.scroll('_x', Crafty.viewport.x - moveSpeed);
            
        }
    });
    
    // Define the main game scene
    Crafty.scene('GameScene',
        // Init
        function() {
            // Listen to update events
            GameScene_Init();
            Crafty.bind('EnterFrame', GameScene_Update);
        // Un-init
        }, function() {
            // No longer listen to this..
            Crafty.unbind('EnterFrame', GameScene_Update);
            GameScene_Uninit();
        }
    );
        
}

/*** Main game scene ***/

var GameScene_GameBackground = null;

function GameScene_Init()
{
    // Allocate background
    GameScene_GameBackground = Crafty.e('GameBackground').initialize(gWorldPolygon);
    
    // Create a single game unit for fun...
    Crafty.e('GameUnit').initialize(gFriendlyUnit1, [20, 50]);
}

function GameScene_Update()
{
    
}

function GameScene_Uninit()
{
    GameScene_GameBackground.destroy();
}

/*** Main Application Loop ***/

// Initialize and start our game
function GameStart()
{
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(gWindowWidth, gWindowHeight).canvas.init();
    Crafty.background( gColorPalette[0] );
    
    // Game load (build data structures)
    Game_Load();
    
    // Set first scene the main game scene...
    Crafty.scene('GameScene');
}