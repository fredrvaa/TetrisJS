/// <reference path="../p5.global-mode.d.ts" />

// Standard tetris grid size
var ROWS = 24;
var COLS = 10;
var CELL_SIZE = 32;
var TICK = 30;
var SIDEHELD = TICK / 4; // How many frames down must be held before shape is dropped faster
var DOWNHELD = TICK / 4; // How many frames down must be held before shape is dropped faster

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
    createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
    frameRate(TICK);
  }
  
function draw() {
    clear();

    if (stage.shape.placed) {
      stage.shape = new Shape([0,5],shapeList[Math.floor(Math.random() * shapeList.length)]);
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