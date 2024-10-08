// DOM related stuff goes here (manipulating DOM, updating UI, handling user inputs)
export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");
import {checkFormComplete, createTask, taskList, deleteFromLibrary} from "./index.js"
import { format } from "date-fns";

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
        // Create task objects
        createTask();
        // Update task card UI
        updateCardUI();
        // Clear form inputs to prepare for new submission
        clearForm();
        // Update project name 
        updateProjectName();
        // Description button functionality
        handleDescriptionBtn();
        // Delete button functionality
        deleteTask();

    }
})

// Gets the user data from the form and exports it to index.js
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
    descriptionBtn.setAttribute("class", "show-description");
    cardOptionsDiv.appendChild(descriptionBtn);

    const editTaskBtn = document.createElement("button");
    editTaskBtn.setAttribute("class", "edit-task");
    descriptionBtn.insertAdjacentElement("afterend", editTaskBtn);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.setAttribute("class", "delete-task");
    editTaskBtn.insertAdjacentElement("afterend", deleteTaskBtn);

    const date = document.createElement("p");
    date.setAttribute("class", "date");
    cardDiv.appendChild(date);

    return {titleDiv, date, cardDiv}
}

// Creates title, date, and priority text from taskList array
function createCardTxt (firstDiv, secondDiv) {
    // Access last element from the array and use that to update title
    let lastElIndex = taskList.length - 1;
    // Update title and date
    firstDiv.innerHTML = `${taskList[lastElIndex].title}`;
        // Reformat date using date-fns
    let oldDateFormat = taskList[lastElIndex].dueDate;
    formatDate(oldDateFormat);
    const {newDateFormat} = formatDate(oldDateFormat);
    secondDiv.innerHTML = `by ${newDateFormat}`;
}

function formatDate(date) {
    const dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    const dateObj = new Date(year, month, day);
    // date using date-fns
    const newDateFormat = format(dateObj, 'PPPP');
    return {newDateFormat};
}

function updateCardUI() {
    // Creates task cards
    const {titleDiv, date} = createCards();
    // Insert title, date, and priority from user data into DOM
    createCardTxt (titleDiv, date);
    setBorderColour ();
}

export function createDefault() {
    // Update title and date
    for (let i = 0; i < 2; i++) {
        const {titleDiv, date, cardDiv} = createCards();
        titleDiv.innerHTML = `${taskList[i].title}`;
        // Reformat date using date-fns
        let oldDateFormat = taskList[i].dueDate;
        formatDate(oldDateFormat);
        const {newDateFormat} = formatDate(oldDateFormat);
        date.innerHTML = `by ${newDateFormat}`;
        // Set the border colour for the default tasks
        if (i === 0) {
            cardDiv.style.borderColor = "green";
        } else {
            cardDiv.style.borderColor = "yellow";
        }
    }
    handleDescriptionBtn();
    deleteTask ();
}

// Assigns unique IDs to each task card
function createDataAttributes() {
    const taskCards = document.querySelectorAll(".task-cards");
    for (let i = 0; i < taskCards.length; i++) {
        taskCards[i].setAttribute("data-id",`${taskList[i].title}`);
    }
}

function setBorderColour () {
    const {priorityVal} = getTaskInput();
    // Get the task-card div that's created
    const borderDiv = document.querySelector(".task-cards:last-child");
    if (priorityVal === "High") {
        borderDiv.style.borderColor = "red";
    } else if (priorityVal === "Medium") {
        borderDiv.style.borderColor = "green";
    } else {
        borderDiv.style.borderColor = "yellow";
    }
}

function handleDescriptionBtn () {
    const description = showDescription();
    const {descriptionDialog} = description;
    closeDescription(descriptionDialog);
}


function showDescription () {
    const descriptionBtn = document.querySelectorAll(".show-description");
    const descriptionDialog = document.getElementById("description-modal");
    for (let i = 0; i < descriptionBtn.length; i++) {
        descriptionBtn[i].addEventListener("click", () => {
            // Show modal
            descriptionDialog.showModal();
            // Update description text
            const div = document.querySelector("#description-modal > div:first-child");
            div.innerHTML = `${taskList[i].description}`;
            // Add display of flex to modal
            descriptionDialog.style.display = "flex";
        })
    }
    return {descriptionDialog}
}

function closeDescription(description) {
    const closeBtn = document.getElementById("close-btn");
    closeBtn.addEventListener("click", () => {
        description.close();
        // Remove display of flex to modal
            // NOTE: for some reason not removing display property interferes with the interactivity of the modal
        description.style.display = "none";
    })
}

function clearForm () {
    const taskForm = document.querySelector("#task-form > form");
    taskForm.reset();
}

function updateProjectName() {
    const headerTitle = document.getElementById("project-name");
    let index = taskList.length - 1
    headerTitle.innerHTML = taskList[index].project;
}

function deleteTask () {
    // Set data attributes for each task card
    createDataAttributes();
    // Make use of event bubbling to know which task card to delete
    document.querySelector(".tasks-container").addEventListener("click", (e) => {
        // Get element to be deleted
        if (e.target.className === "delete-task") {
            let elToRemove = e.target.parentElement.closest(".task-cards");
            // Remove element from library
            deleteFromLibrary(elToRemove);
            // Remove element from DOM
            elToRemove.remove();
        }
    })
}