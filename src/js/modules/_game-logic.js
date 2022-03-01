export const playerFactory = function (no, name, turn, mark) {
    return { no, name, turn, mark };
};

export const gameFactory = function (player1, player2) {
    let gameBoard = [], winner, currentPlayer = player1;

    const initGameBoard = function () {
        for (let i = 0; i < 9; i++) {
            gameBoard[i] = "";
        }
    }

    initGameBoard()

    const setCurrentPlayer = function (player) {
        currentPlayer = player;
    }

    const getCurrentPlayer = function () {
        return currentPlayer;
    }

    const setWinner = function (player) {
        winner = player.name;
    }

    const getWinner = function () {
        return winner;
    }

    const checkEmptyCells = function () {
        let emptyCells = [];
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] == "") {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    }

    const canMark = function (targetIndex) {
        let move = false;
        if (checkEmptyCells().includes(+targetIndex) && !isEnd()) {
            move = true;
        }
        return move;
    }

    const isEnd = function () {
        let end = false;
        if (checkEmptyCells().length == 0 || winner != undefined || winner != null) {
            end = true;
        }
        return end;
    };

    const play = function (targetIndex) {
        if (getCurrentPlayer() == player1 && canMark(targetIndex)) {
            gameBoard[targetIndex] = player1.mark;
            setCurrentPlayer(player2);
            isWinner(player1);
        }

        if (getCurrentPlayer() == player2 && canMark(targetIndex)) {
            gameBoard[targetIndex] = player2.mark;
            setCurrentPlayer(player1);
            isWinner(player2);
        }
    };

    const restart = function () {
        winner = null;
        currentPlayer = player1;
        initGameBoard();
    };

    const isWinner = function (player) {
        if (
            //row
            (gameBoard[0] == player.mark &&
                gameBoard[1] == player.mark &&
                gameBoard[2] == player.mark) ||
            (gameBoard[3] == player.mark &&
                gameBoard[4] == player.mark &&
                gameBoard[5] == player.mark) ||
            (gameBoard[6] == player.mark &&
                gameBoard[7] == player.mark &&
                gameBoard[8] == player.mark) ||
            //column
            (gameBoard[0] == player.mark &&
                gameBoard[3] == player.mark &&
                gameBoard[6] == player.mark) ||
            (gameBoard[1] == player.mark &&
                gameBoard[4] == player.mark &&
                gameBoard[7] == player.mark) ||
            (gameBoard[2] == player.mark &&
                gameBoard[5] == player.mark &&
                gameBoard[8] == player.mark) ||
            //diagnol
            (gameBoard[0] == player.mark &&
                gameBoard[4] == player.mark &&
                gameBoard[8] == player.mark) ||
            (gameBoard[2] == player.mark &&
                gameBoard[4] == player.mark &&
                gameBoard[6] == player.mark)
        ) {
            setWinner(player);
        }
    };

    return { play, restart, isEnd, getWinner, canMark, getCurrentPlayer };
};