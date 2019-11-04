class Player {
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
        this.vColumn = 0; //X
        this.vRow = 0; //Y
        this.maxSpeed = 100; //maximum speed
        this.movingDir = "none"; //movement direction
        //game control
        this.immunity = false;
        this.lastImunity = 0;
        this.life = 3;
        this.score = 0;
        this.maxBombs = 1;
        this.objectsThatCollide = [2, 3, 5];
        this.frame = 0;
        this.walkSoundCD = 0;
        this.bombs = [];

    }
    spawnBomb() {
        if (this.bombs.length < this.maxBombs) {
            this.bombs.push(new Bomb(Math.floor(this.y / 32), Math.floor(this.x / 32)));
            assetsManager.play("spawn_bomb");

        }
    }
    move(dt, grid, assetsManager) {
        //walking sound
        if (this.vColumn != 0 || this.vRow != 0) {
            if (this.walkSoundCD < 1.5) {
                this.walkSoundCD = this.walkSoundCD + this.walkSoundCD * dt;
            } else {
                assetsManager.play("walk");
                this.walkSoundCD = 1;
            }
        } else
            this.walkSoundCD = 2;
        var nRow;
        if (this.vRow != 0)
            nRow = Math.floor((this.y + 1 * (this.vRow / Math.abs(this.vRow))) / 32);
        else
            nRow = Math.floor(this.y / 32);
        var nColumn;
        if (this.vColumn != 0) {
            nColumn = Math.floor((this.x + 1 * (this.vColumn / Math.abs(this.vColumn))) / 32);
        }
        else
            nColumn = Math.floor(this.x / 32);
        var a;
        if (this.vRow == 0) a = 0;
        else a = (this.vRow) / Math.abs(this.vRow);
        var b;
        if (this.vColumn == 0) b = 0;
        else b = (this.vColumn) / Math.abs(this.vColumn);
        if (grid.checkMovement(this.objectsThatCollide, (this.posRow + a), (this.posColumn + b))) {
            this.y = this.y + this.vRow * dt;
            this.x = this.x + this.vColumn * dt;
            grid.cellsArray[this.posRow][this.posColumn].layer = 0;
            grid.cellsArray[nRow][nColumn].layer = 1;
            if (nRow != this.posRow || nColumn != this.posColumn) {
                grid.cellsArray[this.posRow][this.posColumn].layer = 0;
                this.posRow = nRow;
                this.posColumn = nColumn;
            }
            var oldDir = this.movingDir;
            if (this.vColumn > 0)
                this.movingDir = "right";
            if (this.vColumn < 0)
                this.movingDir = "left";
            if (this.vRow > 0)
                this.movingDir = "down";
            if (this.vRow < 0)
                this.movingDir = "up";
            if (this.vRow == 0 && this.vColumn == 0) {
                this.frame = 0
                this.movingDir = "none";
            }
            if (oldDir != this.movingDir)
                this.frame = 0;
            var curPosLayer = grid.cellsArray[this.posRow][this.posColumn].layer;
            if ((curPosLayer == 4 || curPosLayer == 6) && !this.immunity) {
                this.immunity = true;
                this.life--;
                assetsManager.play("hit");
            }
        } else {
            this.x = grid.cellsArray[this.posRow][this.posColumn].x;
            this.y = grid.cellsArray[this.posRow][this.posColumn].y;
        }
    }
    reset() {
        this.posColumn = this.posColumn0;
        this.posRow = this.posRow0;
        this.x = this.posColumn * 32;
        this.y = this.posRow * 32;
        this.vColumn = 0;
        this.vRow = 0;
        this.life = 3;
        this.score = 0;
        this.maxBombs = 1;
    }
    draw(ctx, dt, assetsManager) {
        this.frame += 6 * dt;
        var F = Math.floor(this.frame);
        var key = "player";
        if (this.immunity) {
            key = "player_damaged";
            if (this.lastImunity >= 3) {
                this.lastImunity = 0;
                this.immunity = false;
            } else {
                this.lastImunity = this.lastImunity + dt;
            }
        }
        if (this.movingDir == "down") {
            ctx.drawImage(assetsManager.images[key], (F % 3) * 17, 0, 17, 17, this.x, this.y, this.w, this.h);
        } else if (this.movingDir == "up") {
            ctx.drawImage(assetsManager.images[key], (F % 3) * 17, 34, 17, 17, this.x, this.y, this.w, this.h);

        } else if (this.movingDir == "left") {
            ctx.drawImage(assetsManager.images[key], (F % 3) * 17, 51, 17, 17, this.x, this.y, this.w, this.h);

        } else if (this.movingDir == "right") {
            ctx.drawImage(assetsManager.images[key], (F % 3) * 17, 17, 17, 17, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(assetsManager.images[key], (F % 3) * 17, 68, 17, 17, this.x, this.y, this.w, this.h);
        }
    }
}