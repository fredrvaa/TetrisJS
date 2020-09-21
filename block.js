class Block {
    constructor(row, col, color) {
        this.row = row;
        this.col = col;
        this.color = color;
    }

    moveDown() {
        this.row ++;
    }
    moveLeft() {
        this.col --;
    }
    moveRight() {
        this.col ++;
    }

    draw() {
        fill(color(this.color));
        rect(this.col * CELL_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE, 5, 5)
    }
}