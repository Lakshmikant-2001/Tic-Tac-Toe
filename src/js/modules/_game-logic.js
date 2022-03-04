export const playerFactory = function (no, name, turn, mark) {
  return { no, name, turn, mark };
};

export const gameFactory = function (player1, player2) {
  let gameBoard = [], winner, currentPlayer = player1, winIndex = ["", "", ""], aiMove;

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
    return (checkEmptyCells().includes(+targetIndex) && !isEnd());
  }

  const isEnd = function () {
    return (checkEmptyCells().length == 0 || winner != undefined || winner != null);
  };

  const isVsComputer = function () {
    return (player2.name == "computer");
  }

  const generateRandomIndex = function () {
    let randomIndex = Math.floor(Math.random() * gameBoard.length);
    if (canMark(randomIndex)) {
      return randomIndex;
    }
    else {
      return generateRandomIndex();
    }
  }

  const setAiMove = function (index) {
    aiMove = index;
  }

  const getAiIndex = function () {
    return aiMove;
  }

  const play = function (targetIndex) {
    if (getCurrentPlayer() == player1 && canMark(targetIndex)) {
      gameBoard[targetIndex] = player1.mark;
      isWinner(player1);
      setCurrentPlayer(player2);
    }
    if (getCurrentPlayer() == player2 && canMark(targetIndex)) {
      gameBoard[targetIndex] = player2.mark;
      isWinner(player2);
      setCurrentPlayer(player1);
    }
  };

  const aiPlay = function () {
    if (!isEnd() && getCurrentPlayer() == player2) {
      let targetIndex = generateRandomIndex();
      gameBoard[targetIndex] = player2.mark;
      setAiMove(targetIndex);
      isWinner(player2);
      setCurrentPlayer(player1);
    }
  }

  const restart = function () {
    [winner,aiMove] = [null,null];
    winIndex = ["", "", ""];
    currentPlayer = player1;
    initGameBoard();
  };

  const setWinIndex = function (i1, i2, i3) {
    winIndex = [i1, i2, i3];
  }

  const getWinIndex = function () {
    return winIndex;
  }

  const isWinner = function (player) {
    let probableIndex = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //row
      [0, 3, 6], [1, 4, 7], [2, 5, 8], //column
      [0, 4, 8], [2, 4, 6]             //diagnol
    ];
    probableIndex.forEach(index => {
      if ((gameBoard[index[0]] == player.mark && gameBoard[index[1]] == player.mark && gameBoard[index[2]] == player.mark)) {
        setWinner(player);
        setWinIndex(index[0], index[1], index[2]);
      }
    })
  };

  return { play, restart, isEnd, getWinner, canMark, getCurrentPlayer, getWinIndex, isVsComputer, aiPlay, getAiIndex };
};