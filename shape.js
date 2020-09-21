class Shape{
    constructor(position, shape){
        this.position = position;
        this.shape = shape;
        this.blocks = [];
        for (let p in shape['posDeltas']) {
            let posDelta = shape['posDeltas'][p]
            this.blocks.push(new Block(this.position[0] + posDelta[0], this.position[1] + posDelta[1], shape['color']));
        }
        this.pivot = [this.position[0] + shape['pivot'][0], this.position[1] + shape['pivot'][1]];
        this.placed = false;
    }

    draw(s, f) {
        for (let b in this.blocks) {
            this.blocks[b].draw(s, f);
        }
    }

    moveDown() {
        for (let b in this.blocks) {
            this.blocks[b].moveDown();
        }
        this.pivot[0]++;
        this.position[0]++;
    }

    moveLeft() {
        for (let b in this.blocks) {
            this.blocks[b].moveLeft();
        }
        this.pivot[1]--;
        this.position[1]--;
    }

    moveRight() {
        for (let b in this.blocks) {
            this.blocks[b].moveRight();
        }
        this.pivot[1]++;
        this.position[1]++;
    }

    getRotatedBlocks(angle) {
        let blocks = [];
        for (let b in this.blocks) {
            let oldRow = this.blocks[b].row;
            let oldCol = this.blocks[b].col;
            let newRow = Math.round((oldRow - this.pivot[0]) * cos(angle) + (oldCol - this.pivot[1]) * sin(angle) + this.pivot[0]);
            let newCol = Math.round((oldCol - this.pivot[1]) * cos(angle) - (oldRow - this.pivot[0]) * sin(angle) + this.pivot[1]);

            blocks.push(new Block(newRow, newCol, this.blocks[b].color));
        }
        return blocks;
    }
}

var LShape = {'type':'L', 'color': 'rgb(255, 102, 0)', 'posDeltas': [[0,0], [1,0], [2,0], [2,1]], 'pivot':[1,0]};
var JShape = {'type':'J', 'color': 'rgb(0, 51, 204)', 'posDeltas': [[0,0], [1,0], [2,0], [2,-1]], 'pivot':[1,0]};
var TShape = {'type':'T', 'color': 'rgb(204, 51, 255)', 'posDeltas': [[0,0], [1,0], [1,1], [1,-1]], 'pivot':[1,0]};
var IShape = {'type':'I', 'color': 'rgb(51, 204, 255)', 'posDeltas': [[0,0], [1,0], [2,0], [3,0]], 'pivot':[1.5,-0.5]};
var OShape = {'type':'O', 'color': 'rgb(255, 204, 0)', 'posDeltas': [[0,0], [1,0], [1,1], [0,1]], 'pivot':[0.5,0.5]};
var SShape = {'type':'S', 'color': 'rgb(51, 204, 51)', 'posDeltas': [[0,0], [0,1], [1,0], [1,-1]], 'pivot':[1,0]};
var ZShape = {'type':'Z', 'color': 'rgb(255, 0, 0)', 'posDeltas': [[0,0], [0,-1], [1,0], [1,1]], 'pivot':[1,0]};

var shapeList = [
    LShape,
    JShape,
    TShape,
    IShape,
    OShape,
    SShape,
    ZShape
]