'use strict';
const WALL = '🟫';
const FOOD = '◦';
const POWER_FOOD = '🌶️';
const EMPTY = '';
const CHERRY = '🍒';
const SECOND = 1000;

var gBoard;
var gGame = {
    score: 0,
    isOn: false
};
var gCherryInterval;

function init() {
    gBoard = buildBoard();
    createPacman(gBoard);
    printMat(gBoard, '.board-container');
}

function start() {
    gGame.isOn = true;
    createGhosts(gBoard);
    placingCherries(gBoard);

    var elStartBtn = document.querySelector('.start-btn');
    elStartBtn.style.filter = 'blur(3px)';
}

function buildBoard() {
    const ROWS = 10;
    const COLS = 15;
    var board = [];
    for (var i = 0; i < ROWS; i++) {
        board.push([]);
        for (var j = 0; j < COLS; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === ROWS - 1 ||
                j === 0 || j === COLS - 1 ||
                (j === 4 && i > 2 && i < ROWS - 3) ||
                (j === 7 && i > 2 && i < ROWS - 3) ||
                (j === 10 && i > 2 && i < ROWS - 3)) {
                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = POWER_FOOD;
    board[8][1] = POWER_FOOD;
    board[1][13] = POWER_FOOD;
    board[8][13] = POWER_FOOD;
    return board;
}

// update model and dom:
function updateScore(diff) {
    // model:
    gGame.score += diff;

    // dom:
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score;
}

function gameOver(reason) {
    gGame.isOn = false;

    clearInterval(gGhostsInterval);
    gGhostsInterval = null;

    clearInterval(gCherryInterval);
    gCherryInterval = null;

    // Hiding the game board:
    var elBoardContainer = document.querySelector('.board-container');
    elBoardContainer.style.display = 'none';

    // Defining which message to show when game ends:
    var elGameDoneMsg = document.querySelector('.game-done-msg');
    elGameDoneMsg.innerText = (reason === 'loosing') ? 'GAME OVER' : 'VICTORIOUS!';

    // Showing the game done modal:
    var elGameDoneContainer = document.querySelector('.game-done-modal');
    elGameDoneContainer.style.display = 'block';
}

function playAgain() {
    var elBoardContainer = document.querySelector('.board-container');
    elBoardContainer.style.display = 'block';

    gGame.score = 0;
    updateScore(0);
    init();
    start();

    var elGameDoneContainer = document.querySelector('.game-done-modal');
    elGameDoneContainer.style.display = 'none';
}


function placingCherries(board) {
    gCherryInterval = setInterval(() => {
        var emptyCells = getEmptyCells(board);
        var randIdx = getRandomIntInc(0, emptyCells.length - 1);
        var chosenCellPos = emptyCells[randIdx];
        board[chosenCellPos.i][chosenCellPos.j] = CHERRY;
        renderCell(chosenCellPos, CHERRY);
    }, SECOND * 15);
}
