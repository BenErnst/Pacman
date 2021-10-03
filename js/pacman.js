'use strict';
const PACMAN = '😋';
var gCherrySound = new Audio('audio/cherry_sound.wav');
var gPowerFoodSound = new Audio('audio/powerfood_sound.wav');
var gVictoriousSound = new Audio('audio/victorious_sound.wav');

var gPacman;
function createPacman(board) {
    gPacman = {
        location: {
            i: board.length - 2,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return;

    var nextLocation = getNextLocation(ev)

    if (!nextLocation) return;

    var nextCellContent = gBoard[nextLocation.i][nextLocation.j]

    if (nextCellContent === WALL) return;

    if (nextCellContent === FOOD) updateScore(1);

    if (nextCellContent === CHERRY) {
        updateScore(10);
        gCherrySound.play();
        var elScore = document.querySelector('h2 span');
        elScore.style.color = 'red';
        setTimeout(() => {
            elScore.style.color = 'khaki';
        }, SECOND);
    }

    if (nextCellContent === POWER_FOOD) {
        if (gPacman.isSuper) return;
        gPacman.isSuper = true;
        updateScore(1);
        gPowerFoodSound.play();
        setTimeout(() => {
            gPacman.isSuper = false;
        }, SECOND * 5);
    }

    if (isAllFoodGone()) {
        gVictoriousSound.play();
        gameOver('winning');
    }

    if (nextCellContent === GHOST) {
        if (!gPacman.isSuper) {
            gGameOverSound.play();
            gameOver('loosing');
        }
    }

    // Removing:
    // model:
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // dom:
    renderCell(gPacman.location, EMPTY);

    // Adding:
    gPacman.location = nextLocation;
    // model:
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // dom:
    renderCell(gPacman.location, getPacmanHTML(ev));
}


function getNextLocation(event) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (event.key) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}

function isAllFoodGone() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === FOOD) return false;
        }
    }
    return true;
}

function getPacmanHTML(event) {
    switch (event.key) {
        case 'ArrowUp':
            return `<img src="img/pacman_up.PNG">`;
        case 'ArrowDown':
            return `<img src="img/pacman_down.PNG">`;
        case 'ArrowLeft':
            return `<img src="img/pacman_left.PNG">`;
        case 'ArrowRight':
            return `<img src="img/pacman_right.PNG">`;
        default:
            return null;
    }
}
