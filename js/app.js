//Requirements link "https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub".
//The "score" variable contains the initial value of the score.
var score = 0;
//The "storescore" variable, stores the value of the score of the first level: the score of the second level will start from this value.
//Use of the "localStorage" to avoid loosing this value during the refresh between the first and the second level.
var storescore = parseInt(localStorage.getItem("storescore"));
//The "isleveltwo" variable is a control variable that says if the level is the first or the second.
//Use of the "localStorage" to avoid loosing this value during the refresh between the first and the second level.
var isleveltwo = localStorage.getItem("isleveltwo");
//var Enemy completed with location and speed.
var Enemy = function() {
    // Loading the image by setting this.sprite to the appropriate image in the image folder (already provided).
    this.sprite = 'images/enemy-bug.png';
    //Setting the Enemy initial location. Points randomly chosen between 5 equidistant points inside the rocky avenue.
    var enemyArrayPositionY = [68, 110, 151, 193, 234];
    var enemyYPosition = enemyArrayPositionY[Math.floor(Math.random() * enemyArrayPositionY.length)];
    this.y = enemyYPosition;
    this.x = -100;
    //Setting the Enemy speed. Speeds randomly chosen between 5 speeds.
    var enemyArraySpeed = [50, 70, 90, 110, 130];
    var enemyspeed = enemyArraySpeed[Math.floor(Math.random() * enemyArraySpeed.length)];
    this.speed = enemyspeed;
};

Enemy.prototype.update = function(dt) {
    //Updates the Enemy location.
    this.x = this.x + (this.speed * dt);
    //when the bug reaches the right margin it will appear on the left margin.
    if( this.x > 450){
        this.x=-100;
    };
};

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//var Player completed with initial location.
var Player = function() {
    //Loading the image by setting this.sprite to the appropriate image in the image folder.
    this.sprite = 'images/char-boy.png';
    //Setting the Player initial location.
    this.x = 200;
    this.y = 400;
};

//The update method for the Player. The player cannot leave the grid.
Player.prototype.update = function(dt) {
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y > 400) {
        this.y = 400;
    }
    //If the player reaches the water, it will pass on the second level or, if you are already at the second level, you win
    if (this.y<0) {
        if (isleveltwo === "Yes! this is the second level!") {
            isleveltwo = null;
            storescore = 0;
            score = 0;
            alert("You Won!!! Click OK to start again!");
            StoreVarAndReload();
        }
        else {
            isleveltwo = "Yes! this is the second level!";
            storescore = score + 0;
            alert("You've reached the water! Click OK for the second level!");
            StoreVarAndReload();
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//function handleInput controls the player with arrows.
Player.prototype.handleInput = function(key) {
    if (key === 'right') {
        this.x = this.x + 60;
    };
    if (key === 'left') {
        this.x = this.x - 60;
    };
    if (key === 'up') {
        this.y = this.y - 70;
    };
    if (key === 'down') {
        this.y = this.y + 70;
    };
};

//var Gem completed with location.
var Gem = function() {
    //Loading the image by setting this.sprite to the appropriate image in the image folder.
    this.sprite = 'images/Gem Blue.png';
    //Setting the Gem initial location.
    this.x = objlocation()[0];
    this.y = objlocation()[1];
};

//Draw the gem on the screen.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

if (isleveltwo === "Yes! this is the second level!") {
    //var Rock with location.
    var Rock = function() {
        // Loading the image by setting this.sprite to the appropriate image in the image folder.
        this.sprite = 'images/Rock.png';
        //Setting the Rock initial location.
        this.x = objlocation()[0];
        this.y = objlocation()[1];
    };

    //Draw the rock on the screen.
    Rock.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    var allRocks = [new Rock(), new Rock()];
};

function updateEntities(dt) {
    //add an index parameter to keep track of which enemy we are updating
    allEnemies.forEach(function(enemy, index) {
        // pass the index to the Enemy.prototype.update function so we know which enemy to remove from the array
        enemy.update(dt, index);

    });
    player.update();
}

//Instantiate all the characters and objects
var player = new Player();
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var allGems = [new Gem(), new Gem(), new Gem(), new Gem()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    hitDetection();
});

//hitDetection detects hits for enemies, rocks and gems.
function hitDetection() {
    //HitDetection with enemies
    for(var i = 0; i < allEnemies.length; i++) {
        var xPosition = allEnemies[i].x;
        var yPosition = allEnemies[i].y;
        if(player.x <= xPosition + 50 && player.x >= xPosition && player.y >= yPosition && player.y <= yPosition + 50) {
            isleveltwo = null;
            storescore = 0;
            score = 0;
            localStorage.setItem("score", score);
            StoreVarAndReload();
            alert("Ahi! You hit a bug! Game Over!");
        };
    };
    //HitDetection with rocks
    if (isleveltwo === "Yes! this is the second level!") {
        for(var i = 0; i < allRocks.length; i++){
            var xPosition = allRocks[i].x;
            var yPosition = allRocks[i].y;
            if(player.x <= xPosition + 50 && player.x >= xPosition && player.y >= yPosition && player.y <= yPosition + 50){
                isleveltwo = null;
                storescore = 0;
                score = 0;
                localStorage.setItem("score", score);
                StoreVarAndReload();
                alert("Ahi! You hit a rock! Game Over!");
            };
        };
    };
    //HitDetection with gems
    for(var i = 0; i < allGems.length; i++){
        var xPosition = allGems[i].x;
        var yPosition = allGems[i].y;
        if(player.x <= xPosition + 70 && player.x >= xPosition && player.y >= yPosition && player.y <= yPosition + 70){
            allGems.splice(i, 1);
            if (isleveltwo === "Yes! this is the second level!") {
                storescore = storescore + 10;
            }
            else {
                score +=10;
            };
        };
    };
}

//this function reloads the page and stores the values of the variable "isleveltwo" and "storescore" after the refresh of the page.
function StoreVarAndReload() {
    localStorage.setItem("isleveltwo", isleveltwo);
    parseInt(localStorage.setItem("storescore", storescore));
    window.location.reload();
}

//this function creates random positions inside the rocky avenue.
function objlocation() {
    //Setting the object initial location. Y Points randomly chosen between 7 equidistant points inside the rocky avenue
    var ArrayPositionY = [80, 100, 120, 140, 160, 180, 200];
    var YPosition = ArrayPositionY[Math.floor(Math.random() * ArrayPositionY.length)];
    //Setting the object initial location. X Points randomly chosen between 8 equidistant points from side to side of the grid
    var ArrayPositionX = [0, 60, 120, 180, 240, 300, 360, 400];
    var XPosition = ArrayPositionX[Math.floor(Math.random() * ArrayPositionX.length)];
    return [XPosition, YPosition];
}