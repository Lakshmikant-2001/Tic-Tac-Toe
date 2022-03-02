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