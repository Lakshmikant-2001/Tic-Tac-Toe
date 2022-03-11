import { playerFactory, gameFactory } from "./modules/_game-logic";
import {
  displayResult, updateBoardUI, clearBoardUI, addTurnIndicatorUI, clearAvailableItem,
  displayWinIndex, displayDrawAnimation, updateScore, clearScoreUI, removeCurrentLevel,
  clearAiLvl
} from "./modules/_game-ui-update";
import {
  addAnimation, updateClassList, findItem, blockPointerEvents, unblockPointerEvents
} from "./modules/_utils";

const body = document.querySelector("body");
const gameTypeDivs = document.querySelectorAll(".game-type");
const gameTypeWrapper = document.querySelector("#game-type-wrapper");
const gameDisplayWrapper = document.querySelector("#game-display-wrapper");
const player1NameTag = document.querySelector("#player1-name");
const player2NameTag = document.querySelector("#player2-name");
const startGameBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const returnBtn = document.querySelector("#return-btn");
const message = document.querySelector(".message");
const gameBoard = document.querySelector("#game-board");
const boardItems = document.querySelectorAll(".grid-item");
const aiLvlSettingsBtn = document.querySelector(".level-settings-btn");
const aiLvlOptionsWrapper = document.querySelector(".level-options");
const aiLvlOptions = document.querySelectorAll(".level-options > *");
let gameType;

//game type selection --> game type divs
gameTypeDivs.forEach((gameTypeDiv) => {
  gameTypeDiv.addEventListener("click", () => {
    clearSelection();
    clearMessage();
    addGameTypeSelection(gameTypeDiv);
  });
  gameTypeDiv.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
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
  canStartGame() ? startGame() : displayTypeSelPrompt();
});

function canStartGame() {
  return (gameType == "computer" || gameType == "two-player");
}

function startGame() {
  displayGameLayout();
  addAnimation(gameBoard, "scale-in-animation");
  const players = specifyPlayers(gameType);
  const gameInstance = gameFactory(players[0], players[1]);
  addAiLevelsOption(gameInstance);
  boardItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      playGame(e, gameInstance);
    });
    item.addEventListener("keypress", (e) => {
      if (e.key == "Enter")
        playGame(e, gameInstance);
    })
  });

  restartBtn.addEventListener("click", () => {
    gameInstance.restart();
    clearBoardUI();
    clearScoreUI();
    clearAiLvl();
    addAnimation(gameBoard, "scale-in-animation");
  });

  //return to main menu
  returnBtn.addEventListener("click", () => {
    Object.keys(gameInstance).forEach(key => {
      gameInstance[key] = undefined;
    });
    gameBoard.classList.remove("scale-out-animation");
    aiLvlSettingsBtn.classList.add("none");
    gameType = "";
    unblockPointerEvents();
    displayGameType();
    clearSelection();
    clearBoardUI();
    clearScoreUI();
    clearAiLvl();
  });
}

function playGame(e, gameInstance) {
  if (gameInstance.getCurrentPlayer == undefined)
    return;
  let item = e.currentTarget;
  item.blur();
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
      if (gameInstance.reset != undefined) {
        updateBoardUI(item, currentPlayer);
        addTurnIndicatorUI(nextPlayer);
        unblockPointerEvents();
        gameInstance.isEnd() ? endGame(gameInstance) : "";
      }
    }, 500);
  }
}

function endGame(gameInstance) {
  blockPointerEvents();
  clearAvailableItem()
  displayResult(gameInstance.getWinner());
  displayDrawAnimation(gameInstance.getWinner());
  displayWinIndex(gameInstance.getWinIndex());
  updateScore(gameInstance.getScore());
  addAnimation(gameBoard, "scale-out-animation");
  gameBoard.addEventListener("animationend", (e) => {
    if (e.animationName == "scale-out" && gameInstance.reset != undefined) {
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

function displayGameType() {
  updateClassList([gameTypeWrapper, startGameBtn], "none", "remove");
  updateClassList([gameDisplayWrapper, restartBtn, returnBtn], "none", "add");
}

function specifyPlayers(type) {
  let player1, player2;
  if (type == "computer") {
    player1 = playerFactory(1, "human", true, "X", 0);
    player2 = playerFactory(2, "computer", false, "O", 0);
  }
  if (type == "two-player") {
    player1 = playerFactory(1, "human-1", true, "X", 0);
    player2 = playerFactory(2, "human-2", false, "O", 0);
  }
  player1NameTag.textContent = player1.name;
  player2NameTag.textContent = player2.name;
  return [player1, player2];
}

function addAiLevelsOption(gameInstance) {
  if (gameInstance.isVsComputer()) {
    aiLvlSettingsBtn.classList.remove("none");
    aiLvlSettingsBtn.addEventListener("click", () => {
      aiLvlOptionsWrapper.classList.contains("none") ? dispAiLevels(gameInstance)
        : aiLvlOptionsWrapper.classList.add("none");
    });
    aiLvlSettingsBtn.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        aiLvlOptionsWrapper.classList.contains("none") ? dispAiLevels(gameInstance)
          : aiLvlOptionsWrapper.classList.add("none");
      }
    });
  }
}

function dispAiLevels(gameInstance) {
  if (gameInstance.isVsComputer == undefined)
    return;
  aiLvlOptionsWrapper.classList.remove("none");
  aiLvlOptions.forEach(option => {
    option.addEventListener("click", () => {
      removeCurrentLevel();
      changeAiLevel(option, gameInstance);
    });
    option.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        removeCurrentLevel();
        changeAiLevel(option, gameInstance);
      }
    });
  });
}

function changeAiLevel(option, gameInstance) {
  if (gameInstance.isVsComputer == undefined)
    return;
  let aiLevel = option.getAttribute("value");
  gameInstance.setAiLevel(aiLevel);
  option.classList.add("current-level");
  //reset board
  gameInstance.reset();
  clearBoardUI();
  addAnimation(gameBoard, "scale-in-animation");
}

body.addEventListener("click", (e) => {
  if (!aiLvlSettingsBtn.contains(e.target) && !aiLvlOptionsWrapper.classList.contains("none")) {
    aiLvlOptionsWrapper.classList.add("none");
  }
});

body.addEventListener("keydown", (e) => {
  if ((e.key == "Enter" || e.key == "Escape") && !aiLvlSettingsBtn.contains(e.target) && !aiLvlOptionsWrapper.classList.contains("none")) {
    aiLvlOptionsWrapper.classList.add("none");
  }
});

console.log("%cTIC TAC TOE", "font-size:1.5rem;color:#fad;font-weight:bold");
