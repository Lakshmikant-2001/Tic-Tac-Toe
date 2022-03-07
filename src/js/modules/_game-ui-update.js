const message = document.querySelector(".message");
const boardItems = document.querySelectorAll(".grid-item");
const player1InfoTag = document.querySelector("#player1-info");
const player2InfoTag = document.querySelector("#player2-info");
const player1ScoreTag = document.querySelector("#player1-score");
const player2ScoreTag = document.querySelector("#player2-score");

export const updateBoardUI = function (item, currentPlayer) {
    item.textContent = currentPlayer.mark;
    item.classList.add("marked-item");
    item.classList.remove("available-board-item");
}

export const clearAvailableItem = function () {
    boardItems.forEach(item => {
        item.classList.remove("available-board-item");
    });
}

export const displayResult = function (winner) {
    //draw case
    if (winner == null || winner == undefined) {
        message.classList.remove("hide");
        message.textContent = "it's a draw";
    }
    //win case
    else {
        message.classList.remove("hide");
        message.textContent = winner + " won";
    }
};

export const clearBoardUI = function () {
    boardItems.forEach(item => {
        item.textContent = "";
        item.classList.add("available-board-item");
        item.classList.remove("win-index-animation", "draw-animation", "marked-item");
    });
    message.classList.add("hide");
    player1InfoTag.classList.add("turn-indicator");
    player2InfoTag.classList.remove("turn-indicator");
}

export const addTurnIndicatorUI = function (currentPlayer) {
    if (currentPlayer.no == 1) {
        player1InfoTag.classList.add("turn-indicator");
        player2InfoTag.classList.remove("turn-indicator");
    }
    if (currentPlayer.no == 2) {
        player2InfoTag.classList.add("turn-indicator");
        player1InfoTag.classList.remove("turn-indicator");
    }
}

export const displayWinIndex = function (winIndex) {
    boardItems.forEach(item => {
        if (winIndex.includes(+item.dataset.index)) {
            item.classList.add("win-index-animation");
        }
    })
}

export const displayDrawAnimation = function (winner) {
    if (winner == null || winner == undefined) {
        boardItems.forEach(item => {
            item.classList.add("draw-animation");
        })
    }
}

export const updateScore = function (scores) {
    player1ScoreTag.textContent = scores[0];
    player2ScoreTag.textContent = scores[1];
}

export const clearScoreUI = function () {
    player1ScoreTag.textContent = "0";
    player2ScoreTag.textContent = "0";
}