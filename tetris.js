/// <reference path="../p5.global-mode.d.ts" />

var ROWS = 22;
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

// function preload() {
//   font = loadFont("../PixelMania.ttf");
// }

function setup() {
    createCanvas((COLS + 1) * CELL_SIZE + SIDEBAR_SIZE * 2, (ROWS + 2) * CELL_SIZE);
    frameRate(TICK);
}
  
function draw() {
    if (!stage.gameOver) {
      clear();
      //textFont(font);
      // Draws background 
      background(55);
      stroke(0);
      strokeWeight(3);
      noFill();
      rect(0,0, (COLS + 2) * CELL_SIZE + SIDEBAR_SIZE * 2, (ROWS + 2) * CELL_SIZE);

      // Draws data
      strokeWeight(1);
      stroke(255);
      text(stage.score.toString(), SIDEBAR_SIZE + ((COLS + 1) / 2) * CELL_SIZE, CELL_SIZE);

      // Sets new shape
      if (stage.shape.placed) {
        stage.newShape();
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
}