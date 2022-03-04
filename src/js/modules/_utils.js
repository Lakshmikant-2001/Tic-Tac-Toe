export const addAnimation = function (element, animationClass) {
  element.classList.add(animationClass);
  element.addEventListener("animationend", () => {
    element.classList.remove(animationClass);
  });
}

export const updateClassList = function (elements, className, type) {
  if (type == "add") {
    elements.forEach(element => {
      element.classList.add(className)
    })
  }
  if (type == "remove") {
    elements.forEach(element => {
      element.classList.remove(className)
    })
  }
}

const boardItems = document.querySelectorAll(".grid-item");

export const findItem = function (targetIndex) {
  let item;
  boardItems.forEach(boardItem => {
    if (boardItem.dataset.index == targetIndex)
      item = boardItem;
  })
  return item;
}

export const blockPointerEvents = function () {
  boardItems.forEach(item => {
    item.style.pointerEvents = "none";
  });
}

export const unblockPointerEvents = function () {
  boardItems.forEach(item => {
    item.style.pointerEvents = "unset";
  })
}