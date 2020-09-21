var scores = [0, 40,100,300,1200];

class Stage{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.shape = new Shape([0,5],shapeList[Math.floor(Math.random() * shapeList.length)]);

        this.score = 0;
        this.level = 0;

        // Initialize array of grid size fille with false
        this.blocks = new Array(this.rows).fill(false).map(() => new Array(this.cols).fill(false));
    }

    draw() {
        // Draws grid
        for (let r = 0; r < ROWS + 1; r++){
            strokeWeight(0.5);
            line(0, r * CELL_SIZE, COLS * CELL_SIZE, r * CELL_SIZE);
        }
        for (let c = 0; c < COLS + 1; c++){
            strokeWeight(0.5);
            line(c * CELL_SIZE, 0, c * CELL_SIZE, ROWS * CELL_SIZE);
        }
        
        // Draws placed blocks
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.blocks[r][c]) {
                    this.blocks[r][c].draw();
                }
            }
        }

        // Draws shape
        this.shape.draw();
    }

    

    isOutOfVerticalBounds(row) {
        if (row >= this.rows) {
            return true;
        }
        else {
            return false;
        }
    }

    isOutOfHorizontalBounds(col) {
        if ( 0 > col || col >= this.cols) {
            return true;
        }
        else {
            return false;
        }
    }

    isBlockCollision(row, col) {
        if (this.blocks[row][col] != false) {
            return true;
        }
        return false;
    }

    moveShapeDown(dropped) {
        let moveDown = true;
        for (let sb in this.shape.blocks) {
            let shapeBlock = this.shape.blocks[sb];
            if (this.isOutOfVerticalBounds(shapeBlock.row + 1) || this.isBlockCollision(shapeBlock.row + 1, shapeBlock.col)) {
                moveDown = false;
                break;
            }
        }

        if (moveDown){
            this.shape.moveDown();
        }
        else {
            if (this.shape.blocks.some((b) => b.row < 0)) {
                console.log("YOU LOST");
            }
            else {
                this.shape.placed = true;
                let rowsOfInterest = [];
                for (let b in this.shape.blocks) {
                    let block = this.shape.blocks[b];
                    this.blocks[block.row][block.col] = block;
                    rowsOfInterest.push(block.row);
                }

                // Remove duplicates
                rowsOfInterest = [...new Set(rowsOfInterest)];
                this.calculateScore(rowsOfInterest, dropped);
            }
        }
    }

    moveShapeLeft() {
        if (!this.shape.blocks.some((b) => (this.isBlockCollision(b.row , b.col - 1) || this.isOutOfHorizontalBounds(b.col - 1)))){
            this.shape.moveLeft();
        }
        
    }

    moveShapeRight() {
        if (!this.shape.blocks.some((b) => (this.isBlockCollision(b.row , b.col + 1) || this.isOutOfHorizontalBounds(b.col + 1)))){
            this.shape.moveRight();
        }
    }

    rotateShape() {
        let rotatedClockwise = this.shape.getRotatedBlocks(Math.PI / 2);
        if (rotatedClockwise.some((cw) => (this.isBlockCollision(cw.row, cw.col) || this.isOutOfHorizontalBounds(cw.col) || this.isOutOfVerticalBounds(cw.row)))){
            let rotatedAntiClockwise = this.shape.getRotatedBlocks(-Math.PI / 2);
            if (!rotatedAntiClockwise.some((acw) => (this.isBlockCollision(acw.row, acw.col) || this.isOutOfHorizontalBounds(acw.col) || this.isOutOfVerticalBounds(acw.row)))){
                this.shape.blocks = rotatedAntiClockwise;
            }
        }
        else {
            this.shape.blocks = rotatedClockwise;
        }
    }

    hardDropShape() {
        while (!this.shape.placed) {
            this.moveShapeDown(true);
        }
    }

    softDropShape() {
        if (!this.shape.placed) {
            this.moveShapeDown(true);
        }
    }

    rowFull(row) {
        let colsFilled = 0;
        for (let c in this.blocks[row]) {
            if (this.blocks[row][c] != false) {
                colsFilled++;
            }
        }
        return colsFilled == this.cols;
    }

    clearRow(row) {
        for (let c in this.blocks[row]) {
            this.blocks[row][c] = false;
        }
    }

    calculateScore(rowsOfInterest, dropped) {
        rowsOfInterest.sort().reverse();
        let rowsCleared = 0;
        for (let i = 0; i < rowsOfInterest.length; i++) {
            let row = rowsOfInterest[i] + rowsCleared;
            if (this.rowFull(row)){
                console.log("Clear");
                this.clearRow(row);
                rowsCleared++;

                for (let r = row - 1; r > 0; r--) {
                    for (let c = 0; c < this.cols; c++) {
                        let block = this.blocks[r][c];
                        if (block) {
                            block.moveDown();
                            this.blocks[r + 1][c] = block;
                            this.blocks[r][c] = false;
                        }     
                    }
                }
            }
        }

        
        this.score += scores[rowsCleared] * this.level;

        if (dropped) {
            this.score += this.shape.blocks.length; 
        }

    }
}