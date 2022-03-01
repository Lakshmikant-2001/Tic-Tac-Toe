const message = document.querySelector(".message");
const boardItems = document.querySelectorAll(".grid-item");
const player1InfoTag = document.querySelector("#player1-name");
const player2InfoTag = document.querySelector("#player2-name");

export const updateBoardUI = function (item, currentPlayer) {
    item.textContent = currentPlayer.mark;
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
    });
    message.classList.add("hide");
}

export const addTurnIndicatorUI = function (currentPlayer) {
    if (currentPlayer.no == 1) {
        player1InfoTag.classList.add("turn-indicator");
        player2InfoTag.classList.remove("turn-indicator");
    }
    if (currentPlayer.no == 2) {
        player2InfoTag.classList.add("turn-indicator");
        player2InfoTag.classList.remove("turn-indicator");
    }
}