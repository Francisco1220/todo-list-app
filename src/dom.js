// DOM related stuff goes here (manipulating DOM, updating UI, handling user inputs)

export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");
import {checkFormComplete, createTask, taskList} from "./index.js"

// import (default) image SVGs

import editSVG from "./assets/icons/edit-pen.svg";
import deleteSVG from "./assets/icons/delete.svg";

newTask.addEventListener("click", () => {
    // opens modal
    dialog.showModal();
})

submitTaskBtn.addEventListener("click", (e) => {
    // closes modal
    e.preventDefault();
    // client-side validation (check that inputs are completed)
    getTaskInput();
    checkFormComplete();
    const {closeDialog, alertMessage} = checkFormComplete();
    if (closeDialog === false) {
        alert(alertMessage);
    } else {
        dialog.close();
        createTask();
    }
})

export function getTaskInput () {
    const titleVal = document.getElementById("title").value;
    const descriptionVal = document.getElementById("description").value;
    const dueDateVal = document.getElementById("date").value;
    const priorityVal = document.getElementById("priority").value;
    const projectVal = document.getElementById("project").value
    return {titleVal, descriptionVal, dueDateVal, priorityVal, projectVal}
}

// Create DOM for each task card
function createCards () {
    const divContainer = document.querySelector(".tasks-container");

    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "task-cards");
    divContainer.appendChild(cardDiv);
    
    const checkDiv = document.createElement("div");
    checkDiv.setAttribute("class", "circle-check");
    cardDiv.appendChild(checkDiv);

    const titleDiv = document.createElement("p");
    titleDiv.setAttribute("class", "task-title");
    checkDiv.insertAdjacentElement("afterend", titleDiv);

    const cardOptionsDiv = document.createElement("div");
    cardOptionsDiv.setAttribute("class", "card-interact");
    titleDiv.insertAdjacentElement("afterend", cardOptionsDiv);

    const descriptionBtn = document.createElement("button");
    descriptionBtn.innerHTML = "description";
    cardOptionsDiv.appendChild(descriptionBtn);

    const editImage = document.createElement("img");
    editImage.src = editSVG;
    descriptionBtn.insertAdjacentElement("afterend", editImage);

    const deleteImage = document.createElement("img");
    deleteImage.src = deleteSVG;
    descriptionBtn.insertAdjacentElement("afterend", deleteImage);

    const date = document.createElement("p");
    date.setAttribute("class", "date");
    cardDiv.appendChild(date);
}
