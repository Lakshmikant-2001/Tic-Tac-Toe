const gameTypeDivs = document.querySelectorAll(".game-type");
const gameTypeWrapper = document.querySelector("#game-type-wrapper");
const gameDisplayWrapper = document.querySelector("#game-display-wrapper");
const player1Name = document.querySelector("#player1-name");
const player2Name = document.querySelector("#player2-name");
const startGameBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const returnBtn = document.querySelector("#return-btn");
const message = document.querySelector(".message");
const boardItems = document.querySelectorAll(".grid-item");

let gameType;

//game type selection --> game type divs
gameTypeDivs.forEach((gameTypeDiv) => {
  gameTypeDiv.addEventListener("click", () => {
    gameTypeDiv.blur();
    clearSelection();
    clearMessage();
    addGameTypeSelection(gameTypeDiv);
  });
  gameTypeDiv.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      gameTypeDiv.blur();
      clearSelection();
      clearMessage();
      addGameTypeSelection(gameTypeDiv);
    }
  });
});

function clearSelection() {
  gameTypeDivs.forEach((div) => {
    div.classList.remove("add-border");
  });
}

function clearMessage() {
  message.classList.add("hide");
}

function addGameTypeSelection(type) {
  gameType = type.id;
  type.classList.add("add-animation", "add-border");
  setTimeout(() => {
    type.classList.remove("add-animation");
  }, 750);
}

//load game --> start button
startGameBtn.addEventListener("click", () => {
  loadGame();
  const players = specifyPlayers(gameType);
  const gameInstance = gameFactory(players[0], players[1]);
  gameInstance.play();
  restartBtn.addEventListener("click", () => {
    gameInstance.restart();
  });
});

function loadGame() {
  if (gameType == "computer" || gameType == "two-player") {
    gameTypeWrapper.classList.add("none");
    gameDisplayWrapper.classList.remove("none");
    restartBtn.classList.remove("none");
    returnBtn.classList.remove("none");
    startGameBtn.classList.add("none");
  } else {
    message.classList.remove("hide");
    message.textContent = "Please select one of the game type !";
  }
}

function specifyPlayers(type) {
  if (type == "computer") {
    const player1 = playerFactory("human", true, "X");
    const player2 = playerFactory("computer", false, "O");
    player1Name.textContent += player1.name;
    player2Name.textContent += player2.name;
    return [player1, player2];
  }
  if (type == "two-player") {
    const player1 = playerFactory("human-1", true, "X");
    const player2 = playerFactory("human-2", false, "O");
    player1Name.textContent += player1.name;
    player2Name.textContent += player2.name;
    return [player1, player2];
  }
}

//return to main menu
returnBtn.addEventListener("click", () => {
  window.location.reload();
});

const playerFactory = function (name, turn, mark) {
  return { name, turn, mark };
};

const gameFactory = function (player1, player2) {
  let gameBoard = [], winner;

  const initGameBoard = function () {
    for (let i = 0; i < 9; i++) {
      gameBoard[i] = "";
    }
  }

  const checkEmptyCells = function () {
    let emptyCells = [];
    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] == "") {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  };

  const toggleTurn = function (player) {
    if (player == player1) {
      player1.turn = false;
      player2.turn = true;
      player1Name.classList.remove("turn-indicator");
      player2Name.classList.add("turn-indicator");
    }
    if (player == player2) {
      player2.turn = false;
      player1.turn = true;
      player2Name.classList.remove("turn-indicator");
      player1Name.classList.add("turn-indicator");
    }
  };

  const checkResult = function () {
    if (winner != undefined || checkEmptyCells().length == 0 || winner != null)
      displayResult();
  };

  const displayResult = function () {
    if (checkEmptyCells().length == 0) {
      message.classList.remove("hide");
      message.textContent = "it's a draw";
    }
    if (winner != undefined && winner != null) {
      message.classList.remove("hide");
      message.textContent = winner + " won";
    }
  };

  initGameBoard()

  const play = function () {
    boardItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const targetIndex = e.currentTarget.dataset.index;
        if (winner != undefined) {
          return;
        }
        if (player1.turn == true && checkEmptyCells().includes(+targetIndex)) {
          item.textContent = player1.mark;
          gameBoard[targetIndex] = player1.mark;
          winnerCheck(player1);
          toggleTurn(player1);
          checkResult();
        }

        if (player2.turn == true && checkEmptyCells().includes(+targetIndex)) {
          item.textContent = player2.mark;
          gameBoard[targetIndex] = player2.mark;
          winnerCheck(player2);
          toggleTurn(player2);
          checkResult();
        }
      });
    });
  };

  const restart = function () {
    winner = null;
    message.classList.add("hide");
    boardItems.forEach((item) => {
      item.textContent = "";
    });
    initGameBoard()
    toggleTurn(player2);
  };

  const winnerCheck = function (p) {
    if (
      //row
      (gameBoard[0] == p.mark &&
        gameBoard[1] == p.mark &&
        gameBoard[2] == p.mark) ||
      (gameBoard[3] == p.mark &&
        gameBoard[4] == p.mark &&
        gameBoard[5] == p.mark) ||
      (gameBoard[6] == p.mark &&
        gameBoard[7] == p.mark &&
        gameBoard[8] == p.mark) ||
      //column
      (gameBoard[0] == p.mark &&
        gameBoard[3] == p.mark &&
        gameBoard[6] == p.mark) ||
      (gameBoard[1] == p.mark &&
        gameBoard[4] == p.mark &&
        gameBoard[7] == p.mark) ||
      (gameBoard[2] == p.mark &&
        gameBoard[5] == p.mark &&
        gameBoard[9] == p.mark) ||
      //diagnol
      (gameBoard[0] == p.mark &&
        gameBoard[4] == p.mark &&
        gameBoard[8] == p.mark) ||
      (gameBoard[2] == p.mark &&
        gameBoard[4] == p.mark &&
        gameBoard[6] == p.mark)
    ) {
      winner = p.name;
      return;
    }
  };

  return { play, restart };
};

console.log("%cTIC TAC TOE", "font-size:1.5rem;color:#fad;font-weight:bold");
