import chevronSVG from "./assets/icons/chevron-right.svg";
import {createProject, getProjectTabID, setOptionDataAttr, setProjectTabAttr} from "./index.js"
import {Project} from "./project.js";
import {createTask} from "./index.js";

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
        console.log("New task feature coming soon");
        // show task modal
        newTaskDialog.showModal();
    } else if (e.target.innerHTML === "New Project") {
        console.log("New project feature");
        // Show project modal
        newProjectDialog.showModal();
    } else if (e.target.innerHTML === "Completed") {
        console.log("completed feature coming soon");
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
    // Set last created project tab with the associated ID
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