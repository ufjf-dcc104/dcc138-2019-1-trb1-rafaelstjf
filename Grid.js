/*
------------Grid Codes----------------
0 - Free
1 - Player
2 - Indestructible wall
3 - Destructible wall
4 - Enemies
5 - Bombs
6 - Bomb activated
7 - Power-ups
*/
class Grid {
    constructor(canvasWidth, canvasHeight, cellWidth, cellHeight) {
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.numRows = Math.floor(canvasHeight / cellHeight);
        this.numColumns = Math.floor(canvasWidth / cellWidth);
        this.cellsArray = [];
        this.debug = false;
        for (var i = 0; i < this.numRows; i++) {
            this.cellsArray[i] = [];
            for (var j = 0; j < this.numColumns; j++) {
                var coordinates = {
                    x: j * 32,
                    y: i * 32,
                    layer: 0
                };
                this.cellsArray[i][j] = coordinates;
            }
        }
    }
    draw(ctx, assetManager) {
        for (var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numColumns; j++) {
                if (debug) {
                    ctx.font = "8px Arial";
                    ctx.fillStyle = "blue";
                    ctx.fillRect(this.cellsArray[i][j].x, this.cellsArray[i][j].y, 32, 32);
                    ctx.fillStyle = "white";
                    ctx.fillText(i + ' : ' + j, this.cellsArray[i][j].x + 5, this.cellsArray[i][j].y + 16);
                    ctx.fillText(this.cellsArray[i][j].layer, this.cellsArray[i][j].x + 5, this.cellsArray[i][j].y + 30);
                } else {
                    if (this.cellsArray[i][j].layer == 2) {
                        ctx.drawImage(assetManager.images["indesWall"], this.cellsArray[i][j].x, this.cellsArray[i][j].y, 32, 32);
                    }
                    else if (this.cellsArray[i][j].layer == 3) {
                        ctx.drawImage(assetManager.images["desWall"], this.cellsArray[i][j].x, this.cellsArray[i][j].y, 32, 32);
                    }
                    else if (this.cellsArray[i][j].layer == 1) {
                        ctx.fillStyle = "black";
                        ctx.fillRect(this.cellsArray[i][j].x, this.cellsArray[i][j].y, 32, 32);
                    }
                    else{
                        ctx.drawImage(assetManager.images["free"], this.cellsArray[i][j].x, this.cellsArray[i][j].y, 32, 32);
                    }
                }

            }
        }
    }
    buildFromMatrix(matrix) {
        for (var i = 0; i < this.numRows; i++) {
            for (var j = 0; j < this.numColumns; j++) {
                this.cellsArray[i][j].layer = matrix[i][j];
            }
        }
    }
    checkPos(row, column) {
        if (row >= 0 && row < this.numRows && column >= 0 && column < this.numColumns)
            return true;
        return false;
    }
    checkMovement(objectsThatCollide, nRow, nColumn) {
        var canMove = true;
        if (this.checkPos(nRow, nColumn)) {
            // if (nRow == 0 || nRow == this.numRows - 1 || nColumn == 0 || nColumn == this.numColumns - 1)
            //     canMove = false;
            for (var i = 0; i < objectsThatCollide.length; i++) {
                if (this.cellsArray[nRow][nColumn].layer == objectsThatCollide[i]) {
                    canMove = false;
                    break;
                }
            }
        } else {
            canMove = false;
        }
        return canMove;
    }
}


