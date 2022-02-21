console.log("%cTIC TAC TOE", "font-size:1.5rem;color:#fad;font-weight:bold");

const gameTypeDivs = document.querySelectorAll(".game-type");

gameTypeDivs.forEach((gameTypeDiv) => {
  gameTypeDiv.addEventListener("click", () => {
    gameTypeDiv.blur();
    clearSelection();
    addTypeSelection(gameTypeDiv);
  });
  gameTypeDiv.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      gameTypeDiv.blur();
      clearSelection();
      addTypeSelection(gameTypeDiv);
    }
  });
});

function clearSelection() {
  gameTypeDivs.forEach((div) => {
    div.classList.remove("add-border");
  });
}

function addTypeSelection(type) {
  type.classList.add("add-animation", "add-border");
  setTimeout(() => {
    type.classList.remove("add-animation");
  }, 750);
}
