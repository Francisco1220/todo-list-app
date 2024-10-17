// DOM related stuff goes here (manipulating DOM, updating UI, handling user inputs)
export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");
import {checkFormComplete, createTask, taskList, deleteFromLibrary, getTaskObject, updateTaskList, updateTaskCompleted, getProjectInfo, deleteCompleted, deleteProject} from "./index.js"
import { format } from "date-fns";

import chevronImage from "./assets/icons/chevron-right.svg"

newTask.addEventListener("click", () => {
    // opens modal
    dialog.showModal();
})

let currentProjectName = "Default";
// let taskSubmit = false;

submitTaskBtn.addEventListener("click", (e) => {
    // taskSubmit = true;
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
        // Update task card UI if the created task is "Default" Project
        const {projectVal} = getTaskInput();
        // updatePage with new task card if the current page is not "Default" project
        updatePage(projectVal);
        if (projectVal === "Default") {
            // Creates task cards
            const {titleDiv, date} = createCards();
            // Insert title, date, and priority from user data into DOM
            createCardTxt (titleDiv, date);
            const cardDiv = document.querySelector(".task-cards:last-child");
            const {priorityVal} = getTaskInput();
            setBorderColour(cardDiv, priorityVal);
        }
        // Clear form inputs to prepare for new submission
        clearForm();
        createDataAttributes(taskList);
    }
});

// Updates project page with new task when one is created
function refreshPage (projectVal) {
        if (currentProjectName === projectVal) {
            // Get the project tab that corresponds with projectVal
            let projects = document.querySelectorAll("#my-projects > li");
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].innerHTML === projectVal) {
                    // Initiate click event programatically
                    projects[i].click();
                }
            }
        }
}

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

    return {titleDiv, date, cardDiv, checkDiv, descriptionBtn, editTaskBtn, deleteTaskBtn}
}

// Creates title, date, and priority text from taskList array
function createCardTxt (firstDiv, secondDiv) {
    // Access last element from the array and use that to update title
    let lastElIndex = taskList.length - 1;
    // Checks whether the new task is default project or not
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
    let month = dateArr[1] - 1;
    let day = dateArr[2];
    const dateObj = new Date(year, month, day);
    // date using date-fns
    const newDateFormat = format(dateObj, 'PPPP');
    return {newDateFormat};
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
        setBorderColour(cardDiv, taskList[i].priority);
    }
    handleDescriptionBtn();
    createDataAttributes(taskList);
}

// Assigns unique IDs to each task card (for deletion of task card from list, getting the task object to prefill form, updating the task list when done editing, and marking completed tasks)
function createDataAttributes(arr) {
    const taskCards = document.querySelectorAll(".task-cards");
    for (let i = 0; i < taskCards.length; i++) {
        taskCards[i].setAttribute("data-id",`${arr[i].title}`);
    }
}

function setBorderColour (card, priority) {
    // Get the task-card div that's created
    if (priority === "High") {
        card.style.backgroundColor = "#F2B8B5";
    } else if (priority === "Medium") {
        card.style.backgroundColor = "#F7E3B5";
    } else if (priority === "Low") {
        card.style.backgroundColor = "#B2DFDB";
    }
}

function handleDescriptionBtn () {
    const description = showDescription();
    const {descriptionDialog} = description;
    closeDescription(descriptionDialog);
}


function showDescription () {
    const descriptionDialog = document.getElementById("description-modal");
    document.querySelector(".tasks-container").addEventListener("click", (e) => {
        if (e.target.className === "show-description") {
            let taskCard = e.target.parentElement.closest(".task-cards");
            const {description} = getTaskObject(taskCard);
            // Show modal
            descriptionDialog.showModal();
            // Update description text
            const div = document.querySelector("#description-modal > div:first-child");
            div.innerHTML = `${description}`;
            // Add display of flex to modal
            descriptionDialog.style.display = "flex";
        }
    });
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

function updateProjectName(projectName) {
    const headerTitle = document.getElementById("project-name");
    headerTitle.innerHTML = projectName;
}

(function deleteTask () {
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
})();

const editDialog = document.getElementById("edit-form");
let elToEdit;

// If edit button clicked: show modal, prefill form
document.querySelector(".tasks-container").addEventListener("click", (e) => {
    if (e.target.className === "edit-task") {
        // Show modal
        editDialog.showModal();
        // Get the user input for specific task-card and prefill that data in edit-task form
        elToEdit = e.target.parentElement.closest(".task-cards"); // Element to edit
        prefillForm(elToEdit);
    }
})


// If submit task button clicked: close modal, update DOM elements, update taskList
document.getElementById("edit-task").addEventListener("click", (e) => {
    e.preventDefault();
    const {titleVal, dueDateVal, priorityVal} = getEditInputs();
    // Update TaskList
    if (titleVal === "" || priorityVal === "" || dueDateVal === "") {
        alert('Please make sure you have filled out "Title", "Priority", and "Due Date"');
    } else {
        updateTaskList(elToEdit);
        // Remove previous data attribute and replace with new one
        elToEdit.dataset.id = titleVal;
        // Update DOM elements
        elToEdit.querySelector(".task-title").innerHTML = titleVal;
        let oldDateFormat = dueDateVal;
        const {newDateFormat} = formatDate(oldDateFormat);
        elToEdit.querySelector(".date").innerHTML = newDateFormat;
        setBorderColour(elToEdit, priorityVal);
        // Close modal
        editDialog.close();
    }
})

// Get edit-task form inputs and update the taskList with the new values
export function getEditInputs() {
    const titleVal = document.getElementById("edit-title").value;
    const descriptionVal = document.getElementById("edit-description").value;
    const dueDateVal = document.getElementById("edit-date").value;
    const priorityVal = document.getElementById("edit-priority").value;
    const projectVal = document.getElementById("edit-project").value;
    return {titleVal, descriptionVal, dueDateVal, priorityVal, projectVal}
}

// Get previously completed task-form data and prefill edit-task form
function prefillForm(el) {
            let getTaskObjects = getTaskObject(el);
            const {title, description, priority, project, dueDate} = getTaskObjects;
            
            let titleInput = document.getElementById("edit-title");
            titleInput.value = title;
            let descriptionInput = document.getElementById("edit-description");
            descriptionInput.value = description;
            let priorityInput = document.getElementById("edit-priority");
            priorityInput.value = priority;
            let projectInput = document.getElementById("edit-project");
            projectInput = project;
            let dateInput = document.getElementById("edit-date");
            dateInput.value = dueDate;
}

(function completeTask() {
    let elToComplete;
    document.querySelector(".tasks-container").addEventListener("click", (e) => {
        if (e.target.className === "circle-check") {
            // Get the task card that's completed
            elToComplete = e.target.parentElement;
            // Update taskList 
            updateTaskCompleted(elToComplete);
            // Update DOM, ie. remove completed task
            elToComplete.remove();
        }
        // Delete task from list if delete button is clicked
        if (e.target.className === "delete-task") {
            const elToDelete = e.target.parentElement.closest(".task-cards").querySelector("p").innerHTML;
            deleteCompleted(elToDelete);
        }
    })
})();


// Come back to change project name feature later

// Completed Task feature
document.querySelector("li:nth-child(10)").addEventListener("click", () => {
    // Clear main
    let clearCards = document.querySelectorAll(".task-cards");
    for (let i = 0; i < clearCards.length; i++) {
        clearCards[i].remove();
    }
    // Display message if no tasks have been completed yet
    const {trueCounter} = checkIfNoCompleted();
    // Call createCards for those cards whose taskList[i].completed is set to true
    if (trueCounter > 0) {
        displayCompleted();
    }
    // Make header button invisible
    let headerBtn = document.querySelector(".delete-project");
    headerBtn.style.opacity = "0";
    // Edit innerHTML of what was before the header title
    let headerTitle = document.getElementById("project-name");
    headerTitle.innerHTML = "Completed Tasks";
})

// Checks if there are zero completed tasks any if so, show the message from showNoCompleted()
function checkIfNoCompleted () {
    let trueCounter = 0;
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].completed === true) {
                trueCounter++;
            }
            if (i + 1 === taskList.length && trueCounter === 0) {
                showNoCompleted();
            }
        }
    return {trueCounter}
}

function showNoCompleted () {
    // Create p tag and append to task container
    const p = document.createElement("p");
    const parent = document.querySelector(".tasks-container");
    p.innerHTML = "No Tasks have been Completed Yet";
    p.style.opacity = "0.3";
    p.setAttribute("class", "no-completed");
    p.style.fontSize = "2rem";
    parent.appendChild(p);
}

function displayCompleted() {
    for (let i = 0; i < taskList.length; i++) {
        // For every task object whose completed value is set to true, show that task and style it accordingly
        if (taskList[i].completed === true) {
            const {titleDiv, date, cardDiv, checkDiv, descriptionBtn, editTaskBtn, deleteTaskBtn} = createCards();
            titleDiv.innerHTML = taskList[i].title;
            // Render date correctly
            let oldDateFormat = taskList[i].dueDate;
            const {newDateFormat} = formatDate(oldDateFormat);
            date.innerHTML = `by ${newDateFormat}`;
            // Custom styles for completedTasks
            checkDiv.setAttribute("data-check-svg", "");
            titleDiv.setAttribute("class", "strikethrough");
            date.setAttribute("class", "strikethrough");
            cardDiv.style.borderColor = setBorderColour(cardDiv, taskList[i].priority);
            editTaskBtn.style.opacity = "0.2";
            descriptionBtn.style.opacity = "0.2";
            // Disable checkDiv, description button, and edit button events
            checkDiv.style["pointer-events"] = "none";
            editTaskBtn.style["pointer-events"] = "none";
            descriptionBtn.style["pointer-events"] = "none";
        }
    }
}

const newProjectDialog = document.getElementById("project-form");

(function createNewProject () {
    document.getElementById("new-project").addEventListener("click", () => {
        // Show modal
        newProjectDialog.showModal();
    })
    // Project-form submit button
    document.getElementById("edit-name").addEventListener("click", (e) => {
        e.preventDefault();
        // Get user input from form
        let newProjectName = document.getElementById("new-project-name").value;
        if (newProjectName === "") {
            alert("Project name cannot be empty");
        } else {
            // Clear form input
            document.querySelector("#project-form > form").reset();
            // Add input as a dropdown option when creating new task with new-task form
            addProjectToTaskForm(newProjectName);
            // Add input as a dropdown option when editing task card with edit-task form
            addProjectToEditForm (newProjectName);
            // Create a new project tab under My Projects
            createProjectTab (newProjectName);
            // Close modal
            newProjectDialog.close();
        }
    });
})();

function addProjectToTaskForm (projectName) {
    // Add to task form
    const newProjectOption = document.createElement("option");
    const projectDropdown = document.getElementById("project");
    newProjectOption.innerHTML = projectName;
    projectDropdown.appendChild(newProjectOption);
}

function addProjectToEditForm (projectName) {
    // Add to edit task form
    const newProjectOption = document.createElement("option");
    const projectDropdown = document.getElementById("edit-project");
    newProjectOption.innerHTML = projectName;
    newProjectOption.setAttribute("selected", "selected");
    projectDropdown.appendChild(newProjectOption);
}

function createProjectTab (projectName) {
    // Create new elements
    const tabLi = document.createElement("li");
    const tabIcon = document.createElement("img");
    tabLi.innerHTML = projectName;
    tabLi.setAttribute("class", "projects");
    tabLi.style.fontSize = "1.2rem";
    tabIcon.setAttribute("class", "project-icon");
    tabIcon.src = chevronImage;
    const myProjects = document.getElementById("my-projects");
    myProjects.appendChild(tabIcon);
    myProjects.appendChild(tabLi);
}

// Creates the project page when a project tab is clicked
(function createProjectPage () {
    document.getElementById("my-projects").addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            // First check if the p element(no-completed) exists
            if (document.querySelector(".no-completed")) {
                // Remove element
                document.querySelector(".no-completed").remove();
                // Bring back headerBtn
                let headerBtn = document.querySelector(".delete-project");
                headerBtn.style.opacity = "10";
            }
            currentProjectName = e.target.innerHTML;
            // Update header title
            updateProjectName(currentProjectName);
            // Clear main
            let clearCards = document.querySelectorAll(".task-cards");
            for (let i = 0; i < clearCards.length; i++) {
                clearCards[i].remove();
            }
            // Update DOM with respective taskList object that coincides with the name of the current project
                // Filter tasks that match currentProjectName
            const {filteredArray} = getProjectInfo (currentProjectName);
            for (let i = 0; i < filteredArray.length; i++) {
                // Create taskCards
                const {titleDiv, date, cardDiv} = createCards();
                titleDiv.innerHTML = filteredArray[i].title;
                let oldDateFormat = filteredArray[i].dueDate;
                const {newDateFormat} = formatDate(oldDateFormat);
                date.innerHTML = newDateFormat;
                setBorderColour(cardDiv, filteredArray[i].priority);
            }
            createDataAttributes(filteredArray);
            // Description button functionality
            handleDescriptionBtn();
        }
    })
})();

document.querySelector(".delete-project").addEventListener("click", (e) => {
    let projectToDelete = e.target.parentElement.querySelector("#project-name").innerHTML;
    if (projectToDelete === "Default") {
        alert("Default project folder cannot be deleted");
    } else {
        // Delete from DOM
            // Clear main
        let clearCards = document.querySelectorAll(".task-cards");
        for (let i = 0; i < clearCards.length; i++) {
            clearCards[i].remove();
        }
            // delete project folder tab from my projects
        deleteProjectTab (projectToDelete)
        // Delete from taskList
        deleteProject(projectToDelete);
    }
})

function deleteProjectTab (element) {
    let projects = document.querySelectorAll(".projects");
    let projectIcons = document.querySelectorAll(".project-icon");
    // Delete
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].innerHTML === element) {
            projects[i].remove();
            projectIcons[i].remove();
        }
    }
    // Switch to default tab
    let defaultTab = document.getElementById("my-projects").querySelector("#default-project");
    defaultTab.click();
}

let notesModal = document.getElementById("notes-modal");

document.querySelector(".edit-notesBtn").addEventListener("click", () => {
    // Open modal
    notesModal.showModal();
    // Get notes input
    getNotesInput ()
})

function getNotesInput () {
    let textAreaInput;
    document.getElementById("notesBtn").addEventListener("click", (e) => {
        e.preventDefault();
        textAreaInput = document.querySelector("textarea").value;
        // Close modal
        notesModal.close();
        // Display to DOM
        let notes = document.querySelector(".notes-area");
        notes.innerHTML = textAreaInput;
    })
}

