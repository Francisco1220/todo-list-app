import chevronSVG from "./assets/icons/chevron-right.svg";
import {createProject, getProjectTabID} from "./index.js"

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

// Menu tabs
document.getElementById("menu").addEventListener("click", (e) => {
    if (e.target.innerHTML === "New Task") {
        console.log("New task feature coming soon");
    } else if (e.target.innerHTML === "New Project") {
        console.log("New project feature");
        // Show modal
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
        // Create project tabs
        createProjectTab(projectInput);
        // close modal
        newProjectDialog.close();
        // Clear input
        document.getElementById("project-form").reset();
    })
}

createNewProject();

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
    const {id} = getProjectTabID();
    tabLi.setAttribute("id", id);
    tabIcon.insertAdjacentElement("afterend", tabLi);

}

