class Enemy {
    constructor(row, column) {
        //current Position in the grid
        this.posColumn = column;
        this.posRow = row;
        //initial position in the grid
        this.posColumn0 = column;
        this.posRow0 = row;
        //current coordinates
        this.x = column * 32;
        this.y = row * 32;
        //size
        this.w = 32;
        this.h = 32;
        //speed on X and Y axes
        this.vColumn = 3;
        this.vRow = 3;
        this.maxSpeed = 4; //maximum speed
        this.movingDir = "none"; //movement direction
        //game control
        this.alive = true;
        this.objectsThatCollide = [2, 3, 5];

    }
    move(dt, grid) {
        var nRow = Math.floor((this.y + this.vRow) / 32);
        var nColumn = Math.floor((this.x + this.vColumn) / 32);
        if (grid.checkMovement(this.objectsThatCollide)) {
            this.y = this.y + this.vRow;
            this.x = this.x + this.vColumn;
            grid.cellsArray[nRow][nColumn].layer = 1;
            if (nRow > this.posRow || nColumn > this.posColumn) {
                grid.cellsArray[this.posRow][this.posColumn].layer = 1;
                this.posRow = nRow;
                this.posColumn = nColumn;
            }
            if (this.vColumn > 0)
                this.movingDir = "right";
            if (this.vColumn < 0)
                this.movingDir = "left";
            if (this.vRow > 0)
                this.movingDir = "down";
            if (this.vRow > 0)
                this.movingDir = "up";
            if (this.vRow == 0 && this.vColumn == 0)
                this.movingDir = "none";
            var curPosLayer = grid.cellsArray[this.posRow][this.posColumn].layer;
            if (curPosLayer == 6) {
                this.alive = false;
                this.life--;
            }
        }
    }
    draw(ctx) {
        ctx.drawImage(assetsManager.images["player"], this.x, this.y, this.w, this.h);
    }
}