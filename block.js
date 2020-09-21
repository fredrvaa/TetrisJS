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

    draw(s, f) {
        if (s) {
            noFill()
            stroke(color(this.color));
            strokeWeight(2);
        }
        else if (f) {
            fill(color(this.color));
            stroke(0);
            strokeWeight(2);
        }
        
        rect(this.col * CELL_SIZE + SIDEBAR_SIZE, this.row * CELL_SIZE, CELL_SIZE, CELL_SIZE, 5, 5)
    }
}