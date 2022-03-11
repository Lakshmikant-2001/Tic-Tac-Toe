export const playerFactory = function (no, name, turn, mark, score) {
  return { no, name, turn, mark, score };
};

export const gameFactory = function (player1, player2) {
  let gameBoard = [], winner, currentPlayer = player1, winIndex = ["", "", ""], aiMove, level = "random";

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

  const getEmptyCells = function () {
    let emptyCells = [];
    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] == "") {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }

  const canMark = function (targetIndex) {
    return (getEmptyCells().includes(+targetIndex) && !isEnd());
  }

  const isEnd = function () {
    return (getEmptyCells().length == 0 || winner != undefined || winner != null);
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

  const setWinIndex = function (indexArray) {
    indexArray.forEach(index => winIndex.push(index));
  }

  const getWinIndex = function () {
    return winIndex;
  }

  const isWinner = function (player) {
    let isWinner, winIndex;
    let probableIndex = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //row
      [0, 3, 6], [1, 4, 7], [2, 5, 8], //column
      [0, 4, 8], [2, 4, 6]             //diagnol
    ];
    probableIndex.forEach(index => {
      if ((gameBoard[index[0]] == player.mark && gameBoard[index[1]] == player.mark && gameBoard[index[2]] == player.mark)) {
        isWinner = true;
        winIndex = [index[0], index[1], index[2]];
      }
    })
    return [isWinner, winIndex];
  };

  const setScore = function (player) {
    player.score++;
  }

  const getScore = function () {
    return [player1.score, player2.score];
  }

  const setAiLevel = function (reqLevel) {
    level = reqLevel;
  }

  //Human -> minimizing player, Computer -> maximizing player 
  const miniMax = function (currBoard, currPlayer) {
    const availableCells = getEmptyCells();
    let allPossibleMoves = [];

    if (isWinner(player1)[0]) {
      return { score: -1 };
    }
    if (isWinner(player2)[0]) {
      return { score: 1 };
    }
    if (availableCells.length == 0) {
      return { score: 0 };
    }

    for (let i = 0; i < availableCells.length; i++) {
      let currMove = {};
      currMove.index = availableCells[i];
      currBoard[availableCells[i]] = currPlayer.mark;
      if (currPlayer == player1) {
        currMove.score = miniMax(currBoard, player2).score; //recursive miniMax call
      }
      if (currPlayer == player2) {
        currMove.score = miniMax(currBoard, player1).score; //recursive miniMax call
      }
      allPossibleMoves.push(currMove);
      currBoard[availableCells[i]] = "";  //resetBoard
    }
    return getBestMove(allPossibleMoves, currPlayer);
  }

  const getBestMove = function (moves, player) {
    let bestMove, bestScore;
    if (player == player1) {
      bestScore = Infinity;
      moves.forEach(move => {
        if (move.score < bestScore) {  // minimizing player --> min(bestScore,moveScore)
          bestScore = move.score;
          bestMove = move;
        }
      })
    }
    if (player == player2) {
      bestScore = -Infinity;
      moves.forEach(move => {
        if (move.score > bestScore) {  // maximinzing player --> max(bestScore,moveScore)
          bestScore = move.score;
          bestMove = move;
        }
      })
    }
    return bestMove;
  }

  const play = function (targetIndex) {
    if (getCurrentPlayer() == player1 && canMark(targetIndex)) {
      gameBoard[targetIndex] = player1.mark;
      setCurrentPlayer(player2);
      const result = isWinner(player1);
      if (result[0]) {
        setWinner(player1);
        setWinIndex(result[1]);
        setScore(player1);
      }
    }
    if (getCurrentPlayer() == player2 && canMark(targetIndex)) {
      gameBoard[targetIndex] = player2.mark;
      setCurrentPlayer(player1);
      const result = isWinner(player2);
      if (result[0]) {
        setWinner(player2);
        setWinIndex(result[1]);
        setScore(player2)
      }
    }
  };

  const aiPlay = function () {
    if (!isEnd() && getCurrentPlayer() == player2) {
      let targetIndex;
      if (level == "random") {
        targetIndex = generateRandomIndex();
      }
      if (level == "unbeatable") {
        const aiMove = miniMax(gameBoard, player2);
        targetIndex = aiMove.index;
      }
      gameBoard[targetIndex] = player2.mark;
      setAiMove(targetIndex);
      setCurrentPlayer(player1);
      const result = isWinner(player2);
      if (result[0]) {
        setWinner(player2)
        setWinIndex(result[1]);
        setScore(player2)
      }
    }
  }

  const reset = function () {
    [winner, aiMove] = [null, null];
    winIndex = ["", "", ""];
    currentPlayer = player1;
    initGameBoard();
  };

  const restart = function () {
    reset();
    player1.score = 0;
    player2.score = 0;
    level = "random";
  }

  return {
    play, reset, isEnd, getWinner, canMark, getCurrentPlayer,
    getWinIndex, isVsComputer, aiPlay, getAiIndex, getScore, restart, setAiLevel
  };
};