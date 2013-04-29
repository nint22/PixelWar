
/*** Important Globals ***/

var gWindowWidth = 1000;
var gWindowHeight = 500;

var gColorPalette = ['#EFFFDE', '#ADD794', '#529273', '#183442', '#FF9999', '#FF6666', '#FF2222', '#CC0000'];
var gDeltaCount = 30;

// Time ellapsed over the last frame
var gFrameTime = 0.0;

/*** User Input ***/

var gButtonWidth = 64;
var gButtonHeight = 64;
var gButtonCount = 4;
var gButtonTexts = ["Marine $10", "Mech $30", "Tank $80", "Gunship $200"];

/*** World Geometry ***/

// Programatically generated
var gWorldPolygon = []; //[[0, 350], [10, 400], [50, 410], [100, 405], [200, 380], [250, 395], [250, 350]];
var gPlayerUnitPositions = new Array(3500); /* units mark their presence by setting gPlayUnitPosition[unit.pos] = 1*/
var gEnemyUnitPositions = new Array(3500);

/*** Player Properties ***/

var gPlayerBank = 0;
var gKillCount = 0;     // Number of enemies killed
var gKilledCount = 0;   // Number of friendlies killed

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
        var y = gWindowHeight * 0.9 - pointSpread * 2 +
           10.0 * Math.sin(offset + i) +
           10.0 * Math.sin(offset + i * 100) +
           5.0 * Math.cos( offset + parseFloat(i) / 100.0) +
           5.0 * Math.cos( offset + 100.0 * Math.random() );
        gWorldPolygon.push([x, y]);
    }
    
    // Define how we are drawn...
    Crafty.c("GameUnit", {
        
        init: function(){
            // Register for future updates
            this.bind("EnterFrame",function(e){
            
                // Blank this unit's old position from the list of unit positions
                if (this._unit.stats.speed > 0) {
                    gPlayerUnitPositions[Math.floor(this._pos[0])] = false;
                }
                else {
                    gEnemyUnitPositions[Math.floor(this._pos[0])] = false;
                }

                // Move forward over time
                if (this.enemyIsEverywhere() == false) {
                    this.moveTo(this._pos[0] + this._unit.stats.speed);
                }

                // Set unit's new position in the list of unit positions
                if (this._unit.stats.speed > 0) {
                    gPlayerUnitPositions[Math.floor(this._pos[0])] = true;
                }
                else {
                    gEnemyUnitPositions[Math.floor(this._pos[0])] = true;
                }
                
                // Attempt to fire if possible
                this._weaponReload += gFrameTime;
                if ((this._weaponReload > Math.abs(this._unit.stats.speed)) && (this.enemyIsEverywhere() == true))
                {
                    this._weaponReload = 0.0;
                    var direction = (Math.abs(this._unit.stats.speed)/this._unit.stats.speed);
                    Crafty.e('SampleProjectile').createProjectile(this._pos, [direction * 100, -20], true);
                }
            });
        },
        
        enemyIsEverywhere: function() { /* The mass effect 1 understanding of enemy presence */
            var direction = (Math.abs(this._unit.stats.speed)/this._unit.stats.speed);
            var goodGuy = true;
            if (direction == -1) goodGuy = false;

            if (goodGuy == true) {
                for(var i = Math.floor(this._pos[0]); i < (Math.floor(this._pos[0]) + (this._unit.stats.minRange * gSpriteWidth)); i++) {
                    if (gEnemyUnitPositions[i] == true) {
                        return true;
                    }
                }
            } 
            else {
                for(var i = Math.floor(this._pos[0]); i > (Math.floor(this._pos[0]) - (this._unit.stats.minRange * gSpriteWidth)); i--) {
                    if (gPlayerUnitPositions[i] == true) {
                        return true;
                    }
                }
            } 

            return false;
        },

        initialize: function(unit, pos){
            // Type init            
            this._unit = {};
            this._pos = [0, 0];
            this._sprites = [];
            this._pos = pos;
            
            // Weapon reaload timer
            this._weaponReload = 0;
            
            // Averge for use with movement
            this._deltaIndex = 0;
            this._deltas = new Array(gDeltaCount);
            for(var i = 0; i < gDeltaCount; i++)
                this._deltas[i] = 0.0;
            
            // Deep copy unit
            this._unit.price = unit.price;
            this._unit.stats = {speed:unit.stats.speed, minRange:unit.stats.minRange, accuracy:unit.stats.accuracy, fireRate:unit.stats.fireRate};
            this._unit.size = {width:unit.size.width, height:unit.size.height};
            this._unit.geo = unit.geo;

            // Unit component-sprite sizes
            var spriteWidth = 8;
            var spriteHeight = 8;

            // Generate all relavent sprites
            for(var y = 0; y < this._unit.size.height; y++)
            {
                this._sprites.push( new Array(this._unit.size.width) );
                for(var x = 0; x < this._unit.size.width; x++)
                {
                    // Retained for future movement
                    var colorIndex = this._unit.geo[y][x];
                    if( colorIndex == 0 )
                        continue;
                    this._sprites[y][x] = Crafty.e("2D, Canvas, Color").color( gColorPalette[colorIndex] ).attr({x: pos[0] + x * gSpriteWidth, y: pos[1] + y * gSpriteHeight, w: gSpriteWidth, h: gSpriteHeight});
                }
            }
        },
        
        moveTo: function(px) {
            // Save this as an update
            this._pos[0] = px;
            
            // Which edge are we on?
            var edgeIndex = -1;
            for(var i = 0; i < gWorldPolygon.length - 1; i++)
            {
                if( this._pos[0] > gWorldPolygon[i][0] )
                    edgeIndex = i;
            }
            
            // Ignore if out of bounds
            if( edgeIndex < 0 )
                return;
            
            // Compute intersection point on this edge
            var pt0 = gWorldPolygon[edgeIndex + 0];
            var pt1 = gWorldPolygon[edgeIndex + 1];
            var delta = (pt1[1] - pt0[1]) / (pt1[0] - pt0[0]);
            var b = pt0[1] - delta * pt0[0];
            
            // Update root position
            var pos = [this._pos[0], delta * this._pos[0] + b];
            pos[1] -= this._unit.size.height * gSpriteHeight;
            this._pos = pos;
            
            // Add delta to our moving average
            this._deltaIndex = (this._deltaIndex + 1) % gDeltaCount;
            this._deltas[this._deltaIndex] = delta;
            
            // Sum & average
            delta = 0;
            for(var i = 0; i < gDeltaCount; i++)
                delta += this._deltas[i];
            delta /= parseFloat(gDeltaCount);
            
            // Generate all relavent sprites
            for(var y = 0; y < this._unit.size.height; y++)
            for(var x = 0; x < this._unit.size.width; x++)
            {
                // Retained for future movement
                var colorIndex = this._unit.geo[y][x];
                if( colorIndex == 0 )
                    continue;
                var deltaX = x * gSpriteWidth;
                this._sprites[y][x].attr({x: pos[0] + x * gSpriteWidth, y: pos[1] + y * gSpriteHeight + deltaX * delta, w: gSpriteWidth, h: gSpriteHeight});
            }
        }
    });
    
    // Scenery geometry
    Crafty.c("Scenery", {
        
        initialize: function(scenery, pos){
        
            // Self init
            this._sprites = [];
            this._size = {width: scenery.size.width, height: scenery.size.height};
            this._spriteSize = {width: scenery.spriteSize.width, height: scenery.spriteSize.height};
            this._pos = pos;
            
            // Generate all relavent sprites
            for(var y = 0; y < this._size.height; y++)
            {
                this._sprites.push( new Array(this._size.width) );
                for(var x = 0; x < this._size.width; x++)
                {
                    // Retained for future movement
                    var colorIndex = scenery.geo[y][x];
                    if( colorIndex == 0 )
                        continue;
                    this._sprites[y][x] = Crafty.e("2D, Canvas, Color").color( gColorPalette[colorIndex] ).attr({x: pos[0] + x * this._spriteSize.width, y: pos[1] + y * this._spriteSize.height, w: this._spriteSize.width, h: this._spriteSize.height});
                }
            }
        }
    });
    
    Crafty.c("Particle", {
        _decay: 1,
        init: function() {
            this.addComponent("2D, Canvas, Color");
        },
        createParticle: function(pos, size, decay) {
            this._decay = decay || this._decay;
            this.attr({x:pos[0],
                       y:pos[1],
                       w:size[0],
                       h:size[1]});
            this.color(gColorPalette[3]);

            this.bind("EnterFrame",function(e){ this.update(); });

            return this;
        },
        update: function() {
            var currentSize = this.w;
            if(currentSize > 0) {
                this.attr({w: currentSize - this._decay, h: currentSize - this._decay});
            } else {
                this.destroy();
            }
        }
    });

    Crafty.c("Explosion", {
        _center: null,
        _debrisVectors: [normalize2d([-1, -1]),
                         normalize2d([1, -1]),
                         normalize2d([-1, 1]),
                         normalize2d([1, 1]),
                         normalize2d([-1, 0]),
                         normalize2d([0, 1]),
                         normalize2d([1, 0]),
                         normalize2d([0, -1])
        ],
        _debris: null,
        init: function() {
            this.addComponent('2D, Canvas');
        },
        createExplosion: function(center, size) {
            this._center = center;
            this._debris = [];
            this._size = size;
            for(var i in this._debrisVectors) {
                this._debris.push(Crafty.e('Particle').createParticle(center, [size, size], 0.2));
            }
            this.bind("EnterFrame", function(e){ this.update(); });
        },
        update: function() {
            for(var i in this._debris) {
                var pos = [this._debris[i].x, this._debris[i].y];
                pos = add2d(pos, scale2d(this._debrisVectors[i], this._size/10));
                if (this._debris[i].w > 0) {
                    this._debris[i].attr({x:pos[0], y:pos[1]});
                }
                else {
                    this.destroy();
                }
            }
        }
    });

    var gAccel = [0, 10];
    Crafty.c("SampleProjectile", {
        _pos: null,
        _vel: null,
        _physics: null,
        _spawnTime: null,
        __spawnTimeMax: null,
        init: function() {
            this.addComponent("2D, Canvas, Color, Collision");
            this.bind("EnterFrame", function(e){ this.update(); });
        },
        createProjectile: function(pos, vel, physics) {
            this._pos = pos;
            this._vel = vel;
            this._physics = physics;
            this._spawnTime = 0.0;
            this._spawnTimeMax = 0.2;
            
            this.attr({x: this._pos[0],
                       y: this._pos[1],
                       w: 8,
                       h: 8});
            this.color(gColorPalette[3]);

            this.collision();
            this.onHit('Ground', function() {
                console.log('collision!');
                Crafty.e('Explosion').createExplosion(this._pos, 10);
                this.destroy();
            });

            return this;
        },
        update: function() {
            var dt = gFrameTime;
            this._spawnTime += dt;
            
            this._pos = add2d(this._pos, scale2d(this._vel, dt));
            if(this._physics)
                this._vel = add2d(this._vel, scale2d(gAccel, dt));
            this.attr({x:this._pos[0], y:this._pos[1]});
            
            if(this._spawnTime > this._spawnTimeMax)
            {
                this._spawnTime = 0.0;
                Crafty.e('Particle').createParticle(this._pos, [5, 5], 0.1);
            }
        },
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
                    var spriteHeight = (y == 2) ? 300.0: stepHeight;
                    Crafty.e("2D, Canvas, Color, Ground").color( gColorPalette[y + 1] ).attr({x: pt[0] - leftLength, y: pt[1] + y * stepHeight + leftHeight, w: leftLength, h: spriteHeight});
                    Crafty.e("2D, Canvas, Color, Ground").color( gColorPalette[y + 1] ).attr({x: pt[0], y: pt[1] + y * stepHeight + rightHeight, w: rightLength, h: spriteHeight});
                    
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

function GameScene_Init()
{
    // Allocate background and both HQs
    Crafty.e('Scenery').initialize(sceneryHQ0, [50, 225]);
    Crafty.e('Scenery').initialize(sceneryHQ1, [2800, 225]);
    Crafty.e('GameBackground').initialize(gWorldPolygon);
    
    // Important to leave the UI last
    GameScene_InitUI();
}

function GameScene_InitUI()
{
    // For each button
    for(var i = 0; i < gButtonCount; i++)
    {
        var px = (gWindowWidth / gButtonCount) * i + (gWindowWidth / gButtonCount) / 2 - gButtonWidth / 2;
        var py = gWindowHeight - gButtonHeight - 8;
        
        // Button
        Crafty.e("2D, Canvas, Color, Mouse")
        .color(gColorPalette[1])
        .attr({ x: px, y: py, w: gButtonWidth, h: gButtonHeight, px: px, unitIndex: i })
        .bind('MouseOver', function() { this.color(gColorPalette[2]) })
        .bind('MouseOut', function() { this.color(gColorPalette[1]) })
        .bind('Click', function() { Crafty.e('GameUnit').initialize(gFriendlyUnits[this.unitIndex], [80, 80]); })
        .areaMap([0,0], [gButtonWidth,0], [gButtonWidth,gButtonHeight], [0,gButtonHeight])
        .bind('EnterFrame', function() {
            this.x = -Crafty.viewport.x + this.px;
        });
        
        // Text
        Crafty.e("2D, DOM, Text")
        .attr({ x: px, y: py + gButtonHeight * 0.25, w: gButtonWidth, h: gButtonHeight * 0.5, px: px })
        .text(gButtonTexts[i])
        .textFont({ type: 'italic', family: 'Arial' })
        .textColor(gColorPalette[3])
        .bind('EnterFrame', function() {
            this.x = -Crafty.viewport.x + this.px;
        });
    }

    var px = (gWindowWidth / gButtonCount) * 0.5 + (gWindowWidth / gButtonCount) / 2 - gButtonWidth / 2;
    var py = gWindowHeight - gButtonHeight - 8;

    /*
    // Make me an enemy Button, DEBUG
    Crafty.e("2D, Canvas, Color, Mouse")
    .color(gColorPalette[5])
    .attr({ x: px, y: py, w: gButtonWidth, h: gButtonHeight, px: px, unitIndex: 0})
    .bind('MouseOver', function() { this.color(gColorPalette[7]) })
    .bind('MouseOut', function() { this.color(gColorPalette[6]) })
    .bind('Click', function() { Crafty.e('GameUnit').initialize(gEnemyUnits[0], [2770, 255]); })
    .areaMap([0,0], [gButtonWidth,0], [gButtonWidth,gButtonHeight], [0,gButtonHeight])
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + this.px;
    });
    
    // Text
    Crafty.e("2D, DOM, Text")
    .attr({ x: px, y: py + gButtonHeight * 0.10, w: gButtonWidth, h: gButtonHeight * 0.5, px: px })
    .text("Make me an enemy")
    .textFont({ type: 'italic', family: 'Arial' })
    .textColor(gColorPalette[7])
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + this.px;
    }); END DEBUG*/
    
    // Draw cash flow and unit counts
    Crafty.e("2D, Canvas, Color")
    .color(gColorPalette[1])
    .attr({ x:5, y:5, w: 100, h: 50 })
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + 5;
    });
    
    Crafty.e("2D, DOM, Text")
    .attr({ x:5, y:5, w: 100, h: 25 })
    .text( "Cash:" )
    .textColor(gColorPalette[3])
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + 5;
    });
    
    Crafty.e("2D, DOM, Text")
    .attr({ x:5, y:25, w: 100, h: 25 })
    .text( "$0" )
    .textColor(gColorPalette[3])
    .bind('EnterFrame', function() {
        this.text = "$" + gPlayerBank;
        this.x = -Crafty.viewport.x + 5;
    });
    
    // Draw kill count
    Crafty.e("2D, Canvas, Color")
    .color(gColorPalette[1])
    .attr({ x:5, y:60, w: 100, h: 50 })
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + 5;
    });
    
    Crafty.e("2D, DOM, Text")
    .attr({ x:5, y:60, w: 100, h: 25 })
    .text( "Killed / Dead:" )
    .textColor(gColorPalette[3])
    .bind('EnterFrame', function() {
        this.x = -Crafty.viewport.x + 5;
    });
    
    Crafty.e("2D, DOM, Text")
    .attr({ x:5, y:85, w: 100, h: 25 })
    .text( "0 / 0" )
    .textColor(gColorPalette[3])
    .bind('EnterFrame', function() {
        this.text = gKillCount + " / " + gKilledCount;
        this.x = -Crafty.viewport.x + 5;
    });
    
}

var gLastFrame = null;
function GameScene_Update()
{
    if(!gLastFrame) {
        gLastFrame = Date.now();
    }
    else {
        var now = Date.now();
        gFrameTime = now - gLastFrame;
        gLastFrame = now;
    }
    gFrameTime /= 1000;
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
