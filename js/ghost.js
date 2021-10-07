'use strict'
const GHOST = 'G';

var gGhosts;
var gGhostsInterval;
var gDeadGhosts = [];
var gGameOverSound = new Audio('audio/gameover_sound.wav');

// 5 ghosts and an interval:
function createGhosts(board) {
    gGhosts = [];
    for (var i = 0; i < 5; i++) {
        createGhost(board);
    }
    gGhostsInterval = setInterval(moveGhosts, SECOND);
}

function createGhost(board) {
    var ghost = {
        location: {
            i: 1,
            j: 7
        },
        currCellContent: FOOD,
        id: getRandomIntInc(1, 5)
    }
    gGhosts.push(ghost);

    board[ghost.location.i][ghost.location.j] = GHOST;
}


function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        if (gPacman.isSuper) {
            if (ghost.location.i === gPacman.location.i &&
                ghost.location.j === gPacman.location.j) {
                var deadGhost = gGhosts.splice(i, 1);
                gDeadGhosts.push(deadGhost[0]);
                continue;
            }
        }
        if (!gPacman.isSuper) {
            if (gDeadGhosts.length) {
                gGhosts.push(...gDeadGhosts);
                gDeadGhosts = [];
            }
        }
        moveGhost(ghost);
    }
}

function moveGhost(ghost) {
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }

    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];
    if (nextCellContent === WALL) return;
    if (nextCellContent === GHOST) return;
    if (nextCellContent === PACMAN) {
        if (gPacman.isSuper) return;
        gameOver('loosing');
        gGameOverSound.play();
        return;
    }

    // Removig:
    // model:
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // dom:
    renderCell(ghost.location, ghost.currCellContent);

    // Adding:
    // model:
    ghost.location = nextLocation;
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j];
    gBoard[ghost.location.i][ghost.location.j] = GHOST;
    // dom:
    renderCell(ghost.location, getGhostHTML(ghost.id));
}

function getMoveDiff() {
    var randNum = getRandomIntInc(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(id) {
    var weakGhostStrHtml = '<span>👻</span>';
    var strongGhostStrHtml = `<span><img src="img/ghost${id}.png"></span>`;
    return (gPacman.isSuper) ? weakGhostStrHtml : strongGhostStrHtml;
}


