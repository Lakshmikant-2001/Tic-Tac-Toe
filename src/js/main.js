import { playerFactory, gameFactory } from "./modules/_game-logic";
import { displayResult, updateBoardUI, clearBoardUI, addTurnIndicatorUI } from "./modules/_game-ui-update";

const gameTypeDivs = document.querySelectorAll(".game-type");
const gameTypeWrapper = document.querySelector("#game-type-wrapper");
const gameDisplayWrapper = document.querySelector("#game-display-wrapper");
const player1InfoTag = document.querySelector("#player1-name");
const player2InfoTag = document.querySelector("#player2-name");
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
  
  boardItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      let item = e.currentTarget;
      let targetIndex = item.dataset.index;
      if (gameInstance.canMark(targetIndex)) {
        let currentPlayer = gameInstance.getCurrentPlayer();
        updateBoardUI(item, currentPlayer)
        gameInstance.play(targetIndex);
        //after play currentPlayer --> next player
        addTurnIndicatorUI(gameInstance.getCurrentPlayer());
      }
      //check for gameEnd 
      if (gameInstance.isEnd()) {
        displayResult(gameInstance.getWinner())
      }
    })
  });

  restartBtn.addEventListener("click", () => {
    gameInstance.restart();
    clearBoardUI()
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
    const player1 = playerFactory(1, "human", true, "X");
    const player2 = playerFactory(2, "computer", false, "O");
    player1InfoTag.textContent += player1.name;
    player2InfoTag.textContent += player2.name;
    return [player1, player2];
  }
  if (type == "two-player") {
    const player1 = playerFactory(1, "human-1", true, "X");
    const player2 = playerFactory(2, "human-2", false, "O");
    player1InfoTag.textContent += player1.name;
    player2InfoTag.textContent += player2.name;
    return [player1, player2];
  }
}

//return to main menu
returnBtn.addEventListener("click", () => {
  window.location.reload();
});

console.log("%cTIC TAC TOE", "font-size:1.5rem;color:#fad;font-weight:bold");
