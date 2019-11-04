var dt = 0;
var prevTime = 0;
var debug = false;
var inGame = false;
var highScore = 0;
var level = 1;
var enemies = [];
var player = new Player(1, 1);
var grid = new Grid(640, 480, 32, 32);
var assetsManager = new AssetsManager();
//BUILD MATRIX FOR EXAMPLE
var m = [];
for (var i = 0; i < grid.numRows; i++) {
    m[i] = [];
}
for (var i = 0; i < grid.numRows; i++) {
    for (var j = 0; j < grid.numColumns; j++) {

        m[i][j] = 0;
    }
}
for (var j = 0; j < grid.numColumns; j++) {
    m[grid.numRows - 1][j] = 2;
    m[0][j] = 2;
}
for (var i = 0; i < grid.numRows; i++) {
    m[i][grid.numColumns - 1] = 2;
    m[i][0] = 2;
}
for (var j = 3; j < grid.numColumns - 5; j++) {
    m[grid.numRows - 5][j] = 3;
}
for (var j = 3; j < grid.numColumns - 5; j++) {
    m[5][j] = 2;
}
function loadImages() {
    //load images
    assetsManager.loadImage("free", "Assets/Sprites/floor.png");
    assetsManager.loadImage("desWall", "Assets/Sprites/destructibleWall.png");
    assetsManager.loadImage("indesWall", "Assets/Sprites/indestructibleWall.png");
    assetsManager.loadImage("portrait", "Assets/Sprites/portrait.png");
    assetsManager.loadImage("player", "Assets/Sprites/player_tileset.png");
    assetsManager.loadImage("player_damaged", "Assets/Sprites/player_tileset2.png");
    assetsManager.loadImage("bomb", "Assets/Sprites/bomb.png");
    assetsManager.loadImage("explosion", "Assets/Sprites/explosion.png");
    while (assetsManager.progress < 100) {
        console.log("Loading images..");
    }
}
function loadAudios() {
    assetsManager.loadAudio("walk", "Assets/Sounds/walk.wav");
    assetsManager.loadAudio("background", "Assets/Sounds/background.mp3");
    assetsManager.loadAudio("hit", "Assets/Sounds/hit.wav");
    assetsManager.loadAudio("explosion", "Assets/Sounds/explosion.wav");
    assetsManager.loadAudio("spawn_bomb", "Assets/Sounds/spawn_bomb.wav");
    while (assetsManager.progress < 100) {
        console.log("Loading audios..");
    }
}
function createEnemies(numEnemies) {
    enemies.splice(0, enemies.length);
    for (var i = 0; i < numEnemies; i++) {
        var posRow = Math.floor(Math.random() * grid.numRows);
        var posCol = Math.floor(Math.random() * grid.numColumns);
        while (grid.cellsArray[posRow][posCol].layer > 0) {
            posRow = Math.floor(Math.random() * grid.numRows);
            posCol = Math.floor(Math.random() * grid.numColumns);
        }
        enemies.push(new Enemy(posRow, posCol));
    }
}
function clearCanvas() {
    //clear the canvas
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawGameOverScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = 'center';
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 32);
    ctx.textAlign = 'center';
    ctx.font = "16px Arial";
    ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, canvas.height / 2);
}
function drawHUD() {
    //draws HUD RECT
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.fillRect(0, 482, canvas.width, canvas.height - 482);
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 482, canvas.width, canvas.height - 482);
    ctx.lineWidth = 1;
    //Draws HUD text
    //ctx.fillStyle = "red";
    //ctx.fillRect(10, 525, 32, 32);
    ctx.drawImage(assetsManager.images["portrait"], 10, 500, 64, 64);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("x" + player.life, 90, 550);
    ctx.fillText("LEVEL " + level, 300, 550);
    ctx.font = "26px Arial";
    ctx.fillText("Score " + player.score, 500, 550);
}
function moveObjects() {
    player.move(dt, grid, assetsManager);
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move(dt, grid);
    }
    for (var i = 0; i < player.bombs.length; i++) {
        player.bombs[i].behave(dt, grid);
        if (player.bombs[i].explosionComplete) {
            player.bombs.splice(i, 1);
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        if (!enemies[i].alive)
            enemies.splice(i, 1);
    }
    for (var i = 0; i < player.bombs.length; i++) {
        if (player.bombs[i].explosionComplete) {
            player.bombs.splice(i, 1);
        }
    }
}
function drawObjects() {
    grid.draw(ctx, assetsManager);
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(ctx, grid);
    }
    for (var i = 0; i < player.bombs.length; i++) {
        player.bombs[i].draw(ctx, grid);
    }
    player.draw(ctx, dt, assetsManager);
    drawHUD();

}
addEventListener("keydown", function (e) {

    if (e.keyCode == 37)//left
        player.vColumn = -player.maxSpeed;
    if (e.keyCode == 38)//up
        player.vRow = -player.maxSpeed;
    if (e.keyCode == 39)//right
        player.vColumn = player.maxSpeed;
    if (e.keyCode == 40)//down
        player.vRow = player.maxSpeed;
    if (e.keyCode == 32) {
        if (inGame) {
            player.spawnBomb();
        }
    }
});
addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 32: //space key
            if (!inGame) {
                player.reset();
                createEnemies();
                inGame = true;
            }
            break;
        case 37: //left arrow key
            player.vColumn = 0;
            break;
        case 38: //up arrow key
            player.vRow = 0;
            break;
        case 39: //right arrow key
            player.vColumn = 0;
            break;
        case 40: //down arrow key
            player.vRow = 0;
            break;
        default:
    }
});
function loop(t) {
    if (inGame == true) {
        clearCanvas();
        dt = (t - prevTime) / 1000;
        moveObjects() //move them first and then check collisions
        drawObjects();
        if (player.life == 0)
            inGame = false;
        prevTime = t;
    } else {
        drawGameOverScreen();
    }
    requestAnimationFrame(loop);
}
//------------------------------------
loadImages();
loadAudios();
grid.buildFromMatrix(m);
createEnemies(5);
requestAnimationFrame(loop);

