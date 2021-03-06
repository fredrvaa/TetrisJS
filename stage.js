var scores = [0, 40,100,300,1200];

class Stage{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;

        // Initialize array of grid size fille with false
        this.blocks = new Array(this.rows).fill(false).map(() => new Array(this.cols).fill(false));

        // Initialize shapes
        this.shape = new Shape([0,3],shapeList[Math.floor(Math.random() * shapeList.length)]);
        this.nextShape = shapeList[Math.floor(Math.random() * shapeList.length)];
        this.heldShape = null;

        this.previewBlocks = this.getPreviewBlocks();

        this.score = 0;
        this.level = 0;
        this.gameOver = false;

        this.shapeSwitched = false;
    }

    draw() {
        // Draws grid
        for (let r = 2; r < ROWS + 1; r++){
            strokeWeight(0.5);
            line(SIDEBAR_SIZE, r * CELL_SIZE, COLS * CELL_SIZE + SIDEBAR_SIZE, r * CELL_SIZE);
        }
        for (let c = 0; c < COLS + 1; c++){
            strokeWeight(0.5);
            line(c * CELL_SIZE + SIDEBAR_SIZE, 2 * CELL_SIZE, c * CELL_SIZE + SIDEBAR_SIZE, ROWS * CELL_SIZE);
        }
        
        // Draws placed blocks
        for (let r = 2; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.blocks[r][c]) {
                    this.blocks[r][c].draw(false,true);
                }
            }
        }

        // Draws preview blocks
        for (let b in this.previewBlocks) {
            this.previewBlocks[b].draw(true, false)
        }

        // Draws shape
        this.shape.draw(false, true);

        // Draws next shape in sidebar
        for (let p in this.nextShape['posDeltas']) {
            let posDelta = this.nextShape['posDeltas'][p]
            let x = SIDEBAR_SIZE + (COLS + posDelta[1]) * CELL_SIZE + SIDEBAR_SIZE / 2 - CELL_SIZE / 2;
            let y = CELL_SIZE * 2 + posDelta[0] * CELL_SIZE;
            stroke(0);
            fill(color(this.nextShape['color']));
            rect(x, y, CELL_SIZE, CELL_SIZE, 5, 5);
        }

        // Draws held shape in sidebar
        if (this.heldShape != null) {
            for (let p in this.heldShape['posDeltas']) {
                let posDelta = this.heldShape['posDeltas'][p]
                let x = (posDelta[1] - 1) * CELL_SIZE + SIDEBAR_SIZE / 2 - CELL_SIZE / 2;
                let y = CELL_SIZE * 2 + posDelta[0] * CELL_SIZE;
                fill(color(this.heldShape['color']));
                rect(x, y, CELL_SIZE, CELL_SIZE, 5, 5);
            } 
        }
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
            this.shape.placed = true;
            this.shapeSwitched = false;
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

    moveShapeLeft() {
        if (!this.shape.blocks.some((b) => (this.isBlockCollision(b.row , b.col - 1) || this.isOutOfHorizontalBounds(b.col - 1)))){
            this.shape.moveLeft();
            this.previewBlocks = this.getPreviewBlocks();
        }
        
    }

    moveShapeRight() {
        if (!this.shape.blocks.some((b) => (this.isBlockCollision(b.row , b.col + 1) || this.isOutOfHorizontalBounds(b.col + 1)))){
            this.shape.moveRight();
            this.previewBlocks = this.getPreviewBlocks();
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
        this.previewBlocks = this.getPreviewBlocks();
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

    holdShape() {
        if (!this.shapeSwitched) {
            if (this.heldShape == null) {
                this.heldShape = this.shape.shape;
                this.shape = new Shape([0,5], this.nextShape);
                this.nextShape = shapeList[Math.floor(Math.random() * shapeList.length)];
            }
            else {
                let s = this.shape.shape;
                this.shape = new Shape(this.shape.position, this.heldShape);
                this.heldShape = s;
            }

            this.shapeSwitched = true;
            this.previewBlocks = this.getPreviewBlocks();
        }
    }

    getPreviewBlocks() {
        let collision = false;
        let rDelta = 0;
        while (!collision) {
            for (let b in this.shape.blocks) {
                let block = this.shape.blocks[b];
                if (this.isOutOfVerticalBounds(block.row + rDelta + 1) || this.isBlockCollision(block.row + rDelta + 1, block.col)){
                    collision = true;
                    break;
                }
            }

            if (collision) {
                let blocks = [];
                for (let b in this.shape.blocks) {
                    let block = this.shape.blocks[b];
                    blocks.push(new Block(block.row + rDelta, block.col, block.color));
                }
                return blocks;
            }
            else {
                rDelta++;
            }
        }
        return null;
    }

    newShape() {
        let lowerPlacement = true;
        let higherPlacement = true;
        for (let p in this.nextShape.posDeltas) {
            let posDelta = this.nextShape.posDeltas[p];
            if (this.isBlockCollision(1 + posDelta[0], 3 + posDelta[1])) {
                lowerPlacement = false;
            }

            if (this.isBlockCollision(posDelta[0], 3 + posDelta[1])) {
                higherPlacement = false;
            }
        }

        if (lowerPlacement) {
            this.shape = new Shape([1,3], this.nextShape);
        }
        else if (higherPlacement) {
            this.shape = new Shape([0,3], this.nextShape);
        }
        else {
            this.gameOver = true;
            console.log("YOU LOST!")
        }
        this.nextShape = shapeList[Math.floor(Math.random() * shapeList.length)];
        this.previewBlocks = this.getPreviewBlocks();
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
                console.log('Clear');
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