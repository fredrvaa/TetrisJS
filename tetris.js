/// <reference path="../p5.global-mode.d.ts" />

// Standard tetris grid size
var ROWS = 24;
var COLS = 10;
var CELL_SIZE = 32;
var TICK = 30;
var SIDEHELD = TICK / 4; // How many frames side arrows must be held before shape is dropped faster
var DOWNHELD = TICK / 4; // How many frames down arrow must be held before shape is dropped faster

var SIDEBAR_SIZE = 32 * 7;

var tickCounter = 0;
var sideHeldCounter = 0;
var downHeldCounter = 0;

var stage = new Stage(ROWS, COLS);

// User input
function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    stage.moveShapeLeft();
  } else if (keyCode == RIGHT_ARROW) {
    stage.moveShapeRight();
  }
  else if (keyCode == DOWN_ARROW) {
    stage.moveShapeDown();
  }
  else if (keyCode == UP_ARROW) {
    stage.rotateShape();
  }
  else if (keyCode == 32) { // Space key
    stage.hardDropShape();
  }
  else if (keyCode == 67) { // C-key
    stage.holdShape();
  }
}

// Resets timer for holding arrow keys
function keyReleased() {
    if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
      sideHeldCounter = 0;
    }
    else if (keyCode == DOWN_ARROW) {
      downHeldCounter = 0;
    }
}

function setup() {
    createCanvas(COLS * (CELL_SIZE + 1) + SIDEBAR_SIZE * 2, ROWS * CELL_SIZE);
    frameRate(TICK);
  }
  
function draw() {
    clear();
    background(55);
    stroke(0);
    strokeWeight(3);
    noFill();
    rect(0,0, COLS * (CELL_SIZE + 1) + SIDEBAR_SIZE * 2, ROWS * CELL_SIZE);

    if (stage.shape.placed) {
      stage.shape = new Shape([0,5], stage.nextShape);
      stage.nextShape = shapeList[Math.floor(Math.random() * shapeList.length)];
      stage.previewBlocks = stage.getPreviewBlocks();
    }

    // Moves shape faster if arrow keys are held
    if (keyIsPressed) {
      if (keyCode == LEFT_ARROW) {
        sideHeldCounter++;
        if (sideHeldCounter > SIDEHELD && tickCounter % (TICK / 2)) {
          stage.moveShapeLeft();
        }
      }
      else if (keyCode == RIGHT_ARROW) {
        sideHeldCounter++;
        if (sideHeldCounter > SIDEHELD && tickCounter % (TICK / 2)) {
          stage.moveShapeRight();
        }
      }
      else if (keyCode == DOWN_ARROW) {
        downHeldCounter++;
        if (downHeldCounter > DOWNHELD && tickCounter % (TICK / 2)) {
          stage.softDropShape(true);
        }
      }
    }

    // Shape gravity
    tickCounter++;
    if (!(tickCounter % TICK)) {
      tickCounter = 0;
      stage.softDropShape(false);
    }
    stage.draw();

}