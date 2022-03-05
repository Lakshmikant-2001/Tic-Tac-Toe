import { playerFactory, gameFactory } from "./modules/_game-logic";
import { displayResult, updateBoardUI, clearBoardUI, addTurnIndicatorUI, clearAvailableItem, displayWinIndex, displayDrawAnimation } from "./modules/_game-ui-update";
import { addAnimation, updateClassList, findItem, blockPointerEvents, unblockPointerEvents } from "./modules/_utils";

const gameTypeDivs = document.querySelectorAll(".game-type");
const gameTypeWrapper = document.querySelector("#game-type-wrapper");
const gameDisplayWrapper = document.querySelector("#game-display-wrapper");
const player1InfoTag = document.querySelector("#player1-name");
const player2InfoTag = document.querySelector("#player2-name");
const startGameBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const returnBtn = document.querySelector("#return-btn");
const message = document.querySelector(".message");
const gameBoard = document.querySelector("#game-board");
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
  type.classList.add("add-border");
  addAnimation(type, "bubble-up-animation")
}

//load game --> start button
startGameBtn.addEventListener("click", () => {
  canStartGame() ? startGame() : displayTypeSelPrompt()
});

function canStartGame() {
  return (gameType == "computer" || gameType == "two-player");
}

function startGame() {
  displayGameLayout();
  addAnimation(gameBoard, "scale-in-animation");
  const players = specifyPlayers(gameType);
  const gameInstance = gameFactory(players[0], players[1]);
  boardItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      playGame(e, gameInstance)
    })
  });

  restartBtn.addEventListener("click", () => {
    gameInstance.reset();
    clearBoardUI();
    addAnimation(gameBoard, "scale-in-animation");
  });
}

function playGame(e, gameInstance) {
  let item = e.currentTarget;
  let targetIndex = item.dataset.index;
  let currentPlayer = gameInstance.getCurrentPlayer(), nextPlayer;
  let canMark = gameInstance.canMark(targetIndex);

  if (canMark) {
    updateBoardUI(item, currentPlayer);
    gameInstance.play(targetIndex);
    nextPlayer = gameInstance.getCurrentPlayer(); //after play currentPlayer --> next player
    addTurnIndicatorUI(nextPlayer);
    gameInstance.isEnd() ? endGame(gameInstance) : "";
  }
  if (gameInstance.isVsComputer() && canMark) {
    gameInstance.aiPlay()
    currentPlayer = nextPlayer;
    nextPlayer = gameInstance.getCurrentPlayer();
    const targetIndex = gameInstance.getAiIndex();
    const item = findItem(targetIndex);
    blockPointerEvents();
    setTimeout(() => {
      updateBoardUI(item, currentPlayer);
      addTurnIndicatorUI(nextPlayer);
      unblockPointerEvents();
      gameInstance.isEnd() ? endGame(gameInstance) : "";
    }, 500);
  }
}

function endGame(gameInstance) {
  blockPointerEvents();
  clearAvailableItem()
  displayResult(gameInstance.getWinner());
  displayDrawAnimation(gameInstance.getWinner());
  displayWinIndex(gameInstance.getWinIndex());
  addAnimation(gameBoard, "scale-out-animation");
  gameBoard.addEventListener("animationend", (e) => {
    if (e.animationName == "scale-out") {
      gameInstance.reset();
      clearBoardUI();
      addAnimation(gameBoard, "scale-in-animation");
      unblockPointerEvents();
    }
  })
}

function displayTypeSelPrompt() {
  message.classList.remove("hide");
  message.textContent = "Please select one of the game type!";
}

function displayGameLayout() {
  updateClassList([gameTypeWrapper, startGameBtn], "none", "add");
  updateClassList([gameDisplayWrapper, restartBtn, returnBtn], "none", "remove");
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
