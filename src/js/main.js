const gameTypeDivs = document.querySelectorAll(".game-type");
const gameTypeWrapper = document.querySelector("#game-type-wrapper");
const gameDisplayWrapper = document.querySelector("#game-display-wrapper");
const player1Name = document.querySelector("#player1-name");
const player2Name = document.querySelector("#player2-name");
const startGameBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const returnBtn = document.querySelector("#return-btn");
const message = document.querySelector(".message");

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
  loadGame()
});

function loadGame(){
  if (gameType == "computer" || gameType == "two-player") {
    updatePlayersInfo(gameType);
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

function updatePlayersInfo(type) {
  if (type == "computer") {
    player1Name.textContent += "human";
    player2Name.textContent += "computer";
  }
  if (type == "two-player") {
    player1Name.textContent += "player-1";
    player2Name.textContent += "player-2";
  }
}


//return to main menu
returnBtn.addEventListener("click", () => {
  window.location.reload();
});

console.log("%cTIC TAC TOE", "font-size:1.5rem;color:#fad;font-weight:bold");
