import chevronSVG from "./assets/icons/chevron-right.svg";
import {createProject, getProjectTabID, setOptionDataAttr, setProjectTabAttr, manageProjectTabs, setTaskDataAttr, updateTaskAsCompleted, getDescription} from "./index.js"
import {Project} from "./project.js";
import {createTask} from "./index.js";
import {Task} from "./task.js";

// Creates task cards when called
export function createCard () {
    const divContainer = document.getElementById("tasks-container");

    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "task-card");
    divContainer.appendChild(cardDiv);

    const checkDiv = document.createElement("div");
    checkDiv.setAttribute("class", "circle-check");
    cardDiv.appendChild(checkDiv);

    const titleDiv = document.createElement("p");
    titleDiv.setAttribute("class", "card-title");
    checkDiv.insertAdjacentElement("afterend", titleDiv);
    
    const cardOptionsContainer = document.createElement("div");
    cardOptionsContainer.setAttribute("class", "card-interact");
    titleDiv.insertAdjacentElement("afterend", cardOptionsContainer);

    const descriptionBtn = document.createElement("button");
    descriptionBtn.setAttribute("class", "descriptionBtn");
    cardOptionsContainer.appendChild(descriptionBtn);

    const editTaskBtn = document.createElement("button");
    editTaskBtn.setAttribute("class", "editTaskBtn");
    descriptionBtn.insertAdjacentElement("afterend", editTaskBtn);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.setAttribute("class", "deleteTaskBtn");
    editTaskBtn.insertAdjacentElement("afterend", deleteTaskBtn);

    const date = document.createElement("p");
    date.setAttribute("class", "date");
    cardDiv.appendChild(date);

    return {cardDiv, titleDiv, checkDiv, descriptionBtn, editTaskBtn, deleteTaskBtn, date}
}

const newProjectDialog = document.getElementById("project-dialog");
const newTaskDialog = document.getElementById("task-dialog");

// Menu tabs
document.getElementById("menu").addEventListener("click", (e) => {
    if (e.target.innerHTML === "New Task") {
        // show task modal
        newTaskDialog.showModal();
    } else if (e.target.innerHTML === "New Project") {
        // Show project modal
        newProjectDialog.showModal();
    } else if (e.target.innerHTML === "Completed") {
        clearAll();
        completedTab();
    }
})

// Creates a new project when create button clicked
function createNewProject () {
    let projectInput;
    document.getElementById("create-project").addEventListener("click", (e) => {
        e.preventDefault();
        // Get input (project name)
        projectInput = document.getElementById("new-project-name").value;
        // Set input as name of project in projectList
        console.log(projectInput);
        createProject(projectInput);
        // Create project tab
        createProjectTab(projectInput);
        // Add project as selectable option in task form
        const {newProjectOption} = addProjectOption(projectInput);
        // Set option with data attribute of project value
        setOptionDataAttr(newProjectOption);
        // close modal
        newProjectDialog.close();
        // Clear input
        document.getElementById("project-form").reset();
    })
}
createNewProject();

function addProjectOption (project) {
    const dropdownProject = document.getElementById("project");
    const newProjectOption = document.createElement("option");
    newProjectOption.innerHTML = project;
    dropdownProject.appendChild(newProjectOption);
    return {newProjectOption}
}

// Close new project form when back button clicked
document.querySelector("#project-form > button:last-child").addEventListener("click", (e) => {
    e.preventDefault();
    newProjectDialog.close();
    // Clear inputs
    document.getElementById("project-form").reset();
})


// Creates project tabs and icons
function createProjectTab (projectName) {
    const tabIcon = document.createElement("img");
    tabIcon.src = chevronSVG;
    tabIcon.setAttribute("class", "tab-icon");

    const projects = document.getElementById("projects");
    projects.appendChild(tabIcon);
    
    const tabLi = document.createElement("li");
    tabLi.setAttribute("class", "tabs");
    
    tabLi.innerHTML = projectName;
    // Set last created project tab with the associated project name
    setProjectTabAttr(tabLi);
    tabIcon.insertAdjacentElement("afterend", tabLi);

}

function createNewTask () {
    document.getElementById("create-task").addEventListener("click", (e) => {
        console.log("new task has been created");
        console.log("create button clicked!");
        e.preventDefault();
        // Get inputs
        getTaskFormInputs();
        // Create task object and add to taskList (check for description or notes)
        createTask();
        // Close modal
        newTaskDialog.close();
        // Clear inputs
        document.getElementById("task-form").reset();
    })
}

createNewTask();

// Close new task form when back button clicked
document.querySelector("#task-form-btns > button:last-child").addEventListener("click", (e) => {
    console.log("back button clicked!");
    e.preventDefault();
    newTaskDialog.close();
    // Clear inputs
    document.getElementById("task-form").reset();
})


// Gets inputs from taskForm
export function getTaskFormInputs () {
    const titleInput = document.getElementById("title").value
    const descriptionInput = document.getElementById("description").value;
    const dateInput = document.getElementById("date").value;
    const priorityInput = document.getElementById("priority").value;
    // Get select option element instead of value and use that to set a data attribute to it
    const projectIndex = document.getElementById("project").selectedIndex;
    const projectInput = project[projectIndex].getAttribute("data-project");
    return {titleInput, descriptionInput, dateInput, priorityInput, projectInput}
}

function currentProject () {
    document.getElementById("projects").addEventListener("click", (e) => {
        if (e.target.nodeName === "LI") {
            // Clear all taskCards
            clearAll();
            // Create task cards for current selected project tab. Filter taskList for 'project' key
            const currentProject = e.target.getAttribute("data-project");
            const projectTasks = Task.taskList.filter((task) => task.project === currentProject && task.isTaskComplete === false);
            console.log(projectTasks)
            for (let i = 0; i < projectTasks.length; i++) {
                const {cardDiv, titleDiv, date} = createCard();
                titleDiv.innerHTML = projectTasks[i].title;
                date.innerHTML = projectTasks[i].dueDate;
                // Set data ids for task cards
                const id = projectTasks[i].id;
                cardDiv.setAttribute("data-id", id);
            }
        }
        manageTaskCardUI();
    })
}

// Clears all task cards when called
function clearAll() {
    const taskCards = document.querySelectorAll(".task-card");
    for (let i = 0; i < taskCards.length; i++) {
        taskCards[i].remove();
    }

}

// Display completed tasks
function completedTab () {
    let trueCount = 0;
    Task.taskList.filter((task) => {
        if (task.completed === true) {
            // REVISIT: remove event listeners from description, edit-task, and delete-task buttons
            // REVISIT: Make entire task card opaque
            const {titleDiv, date} = createCard();
            titleDiv.innerHTML = task.title;
            date.innerHTML = task.dueDate;
        } else if (task.completed === true) {
            trueCount++;
            if (trueCount === 0) {
                noCompletedMessage();
            }
        }
    })
}

function noCompletedMessage () {
    const tasksContainer = document.getElementById("tasks-container");
    const p = document.createElement("p");
    p.innerHTML = "No Tasks Completed Yet";
    p.setAttribute("id", "completed-message");
    tasksContainer.appendChild(p);
}

currentProject();

function manageTaskCardUI () {
    const taskCards = document.querySelectorAll(".task-card");
        for (let i = 0; i < taskCards.length; i++) {
            taskCards[i].addEventListener("click", (e) => {
                if (e.target.className === "circle-check") {
                    // Get task card Id
                    const taskComplete = e.target.parentElement;
                    const taskCompleteId = e.target.parentElement.getAttribute("data-id");
                    // Remove task card from container
                    taskComplete.remove();
                    // Update completed value to "true"
                    updateTaskAsCompleted(taskCompleteId);
                } else if (e.target.className === "descriptionBtn") {
                    // Get task card Id
                    const taskCompleteId = e.target.parentElement.closest(".task-card").getAttribute("data-id");
                    showDescription(taskCompleteId);
                    closeDescription();
                } else if (e.target.className === "editTaskBtn") {
                    console.log("Edit this task feature");
                } else if (e.target.className === "deleteTaskBtn") {
                    console.log("Delete this task feature");
                }
            })
        }
}

function showDescription (id) {
    // Get description
    const {description} = getDescription(id);
    // Update modal with text (if any exist)
    const textBox = document.querySelector("#description-modal > div");
    if (description === undefined) {
        alert("No description to show");
    } else {
        // Show modal
        const descriptionModal = document.getElementById("description-modal");
        descriptionModal.showModal();
        textBox.innerHTML = description;
    }
}

function closeDescription () {
    const closeBtn = document.getElementById("close-btn");
    closeBtn.addEventListener("click", () => {
        document.getElementById("description-modal").close();
    })
}