class Bomb {
    constructor(row, column) {
        this.posColumn = column;
        this.posRow = row;
        this.w = 32;
        this.h = 32;
        this.color = "yellow";
        this.strokeColor = "black";
        this.maxTick = 3;
        this.maxTickAE = 1;
        this.currentTick = 0;
        this.readyToExplode = false;
        this.explosionComplete = false;
        this.positionsToExplode = [];
        this.frame = 0;
    }
    calcPosToExplode(grid) {
        /*
        *  checks if the +3 positions of each side (up, down, left and right) aren't indestructible walls,
        * then mark them to explode
        */
        for (var i = 0; i < 3; i++) {
            if (this.posRow + i < grid.numRows && this.posRow + i >= 0 && grid.cellsArray[this.posRow + i][this.posColumn].layer != 2) {
                this.positionsToExplode.push({ row: this.posRow + i, column: this.posColumn });
            } else
                break;
            for (var i = 0; i < 3; i++) {
                if (this.posRow - i < grid.numRows && this.posRow - i >= 0 && grid.cellsArray[this.posRow - i][this.posColumn].layer != 2) {
                    this.positionsToExplode.push({ row: this.posRow - i, column: this.posColumn });
                }
                else
                    break;
            }
            for (var i = 0; i < 3; i++) {
                if (this.posColumn - i < grid.numColumns && this.posColumn - i >= 0 && grid.cellsArray[this.posRow][this.posColumn - i].layer != 2) {
                    this.positionsToExplode.push({ row: this.posRow, column: this.posColumn - i });
                }
                else
                    break;
            }
            for (var i = 0; i < 3; i++) {
                if (this.posColumn + i < grid.numColumns && this.posColumn + i >= 0 && grid.cellsArray[this.posRow][this.posColumn + i].layer != 2) {
                    this.positionsToExplode.push({ row: this.posRow, column: this.posColumn + i });
                }
                else
                    break;
            }
        }
    }
    behave(dt, grid) {
        if (!this.explosionComplete) {
            //placed the bomb and the explosion haven't occurred yet
            if (this.currentTick >= this.maxTick && !this.readyToExplode) {
                this.readyToExplode = true;
                this.frame = 0;
                this.calcPosToExplode(grid);
                for (var i = 0; i < this.positionsToExplode.length; i++) {
                    grid.cellsArray[this.positionsToExplode[i].row][this.positionsToExplode[i].column].layer = 6;
                }
                this.currentTick = 0;
            } else if (this.currentTick < this.maxTick && !this.readyToExplode) {
                this.frame += 6 * dt;
                this.currentTick = this.currentTick + dt;
                if (grid.cellsArray[this.posRow][this.posColumn].layer == 0) //1 second to move
                    grid.cellsArray[this.posRow][this.posColumn].layer = 5;

            } else if (this.currentTick < this.maxTickAE && this.readyToExplode) {
                //now the bomb has exploded but the damage stills on
                this.currentTick = this.currentTick + dt;
            } else if (this.currentTick >= this.maxTickAE && this.readyToExplode) {
                this.readyToExplode = false;
                this.explosionComplete = true;
                for (var i = 0; i < this.positionsToExplode.length; i++) {
                    grid.cellsArray[this.positionsToExplode[i].row][this.positionsToExplode[i].column].layer = 0;
                }
            }
        }
    }
    draw(ctx, grid) {
        var F = Math.floor(this.frame);
        if (this.readyToExplode) {
            for (var i = 0; i < this.positionsToExplode.length; i++) {
                ctx.drawImage(assetsManager.images["explosion"], (F % 27) * 35, Math.floor(F / 3) * 0, 35, 43, grid.cellsArray[this.positionsToExplode[i].row][this.positionsToExplode[i].column].x, grid.cellsArray[this.positionsToExplode[i].row][this.positionsToExplode[i].column].y, this.w, this.h);
            }
        }
        else
            ctx.drawImage(assetsManager.images["bomb"], (F % 3) * 16, Math.floor(F / 3) * 0, 16, 16, grid.cellsArray[this.posRow][this.posColumn].x, grid.cellsArray[this.posRow][this.posColumn].y, this.w, this.h);
    }
}