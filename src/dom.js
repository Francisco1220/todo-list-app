import chevronSVG from "./assets/icons/chevron-right.svg";
import {createProject, getProjectTabID, setOptionDataAttr, setProjectTabAttr, manageProjectTabs, setTaskDataAttr, updateTaskAsCompleted, getDescription, getTaskData, findTask, findTaskIndex, createDescription, createTaskFromEdit, deleteTask} from "./index.js"
import {Project} from "./project.js";
import {createTask} from "./index.js";
import {Task, Description} from "./task.js";

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
const editTaskDialog = document.getElementById("edit-dialog");

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
        createProject(projectInput);
        // Create project tab
        createProjectTab(projectInput);
        // Add project as selectable option in task form
        const {taskOption, editTaskOption} = addProjectOption(projectInput);
        // Set option of task form and edit task form with data attribute of project value
        setOptionDataAttr(taskOption, editTaskOption);
        // close modal
        newProjectDialog.close();
        // Clear input
        document.getElementById("project-form").reset();
    })
}
createNewProject();

function addProjectOption (project) {
    // task form
    const taskDropdown = document.getElementById("project");
    const taskOption = document.createElement("option");
    taskOption.innerHTML = project;
    taskDropdown.appendChild(taskOption);
    // edit task form
    const editTaskDropdown = document.getElementById("edit-project");
    const editTaskOption = document.createElement("option");
    editTaskOption.innerHTML = project;
    editTaskDropdown.appendChild(editTaskOption);
    return {taskOption, editTaskOption}
}


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

function createNewTask (btn) {
    // Get inputs
    const {projectInput} = getTaskFormInputs();
    // Create task object and add to taskList (check for description or notes)
    createTask();
    // Close modal
    newTaskDialog.close();
    // Clear inputs
    document.getElementById("task-form").reset();
    refreshPage(projectInput);
}

/////////////////////////////
document.getElementById("task-form-btns").addEventListener("click", (e) => {
    if (e.target.id === "create-task") {
        e.preventDefault();
        newTaskDialog.close();
        createNewTask(e.target);
        // Clear inputs
        document.getElementById("task-form").reset();
    } else if (e.target.className === "close-form") {
        // Close new task form when back button clicked
        e.preventDefault();
        newTaskDialog.close();
        // Clear inputs
        document.getElementById("task-form").reset();
    }
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
            console.log(projectTasks);
            for (let i = 0; i < projectTasks.length; i++) {
                const {cardDiv, titleDiv, date} = createCard();
                titleDiv.innerHTML = projectTasks[i].title;
                date.innerHTML = projectTasks[i].dueDate;
                // Set data ids for task cards
                const id = projectTasks[i].id;
                cardDiv.setAttribute("data-id", id);
                // Set border colour
                setBorderColour(cardDiv, projectTasks[i].priority);
            }
             // Set project title
             setProjectTitle(currentProject);
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

let taskCardToEdit;

function manageTaskCardUI () {
    const taskCards = document.querySelectorAll(".task-card");
        for (let i = 0; i < taskCards.length; i++) {
            taskCards[i].addEventListener("click", (e) => {
                if (e.target.className === "circle-check") {
                    // Get task card Id
                    const taskComplete = e.target.parentElement;
                    const taskId = e.target.parentElement.getAttribute("data-id");
                    // Remove task card from container
                    taskComplete.remove();
                    // Update completed value to "true"
                    updateTaskAsCompleted(taskId);
                } else if (e.target.className === "descriptionBtn") {
                    // Get task card Id
                    const taskId = e.target.parentElement.closest(".task-card").getAttribute("data-id");
                    showDescription(taskId);
                    closeDescription();
                } else if (e.target.className === "editTaskBtn") {
                    editTaskDialog.showModal();
                    // Populate with previous user input for that task card
                    taskCardToEdit = e.target.parentElement.closest(".task-card");
                    showTaskData(taskCardToEdit);
                } else if (e.target.className === "deleteTaskBtn") {
                    const taskId = e.target.parentElement.closest(".task-card").getAttribute("data-id");
                    // Deletes task instance
                    deleteTask(taskId);
                    // Deletes task card from DOM
                    deleteTaskCard(taskId);
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

function showTaskData (element) {
    const taskCardId = element.getAttribute("data-id");
    const {title, description, date, priority, project} = getTaskData(taskCardId);
    document.getElementById("edit-title").value = title;
    // Check if description property exists in specific taskList instance
    if (description !== undefined) {
        document.getElementById("edit-description").value = description;
    }
    document.getElementById("edit-date").value = date;
    document.getElementById("edit-priority").value = priority;
    // Preselect project based on the project the task card belongs to
    const dropdownOptions = document.querySelectorAll("#edit-project > option");
    dropdownOptions.forEach((option) => {
        if (option.dataset.project === project) {
            option.selected = true;
        }
    })
}

// Close edit task form when back button clicked
document.getElementById("edit-form-btns").addEventListener("click", (e) => {
    if (e.target.id === "edit-task") {
        e.preventDefault();
        // Update task
        const taskCardId = taskCardToEdit.getAttribute("data-id");
        console.log(`ID of task card you want to edit: ${taskCardId}`);
        const {task} = findTask(taskCardId);
        console.log(task);
        // Update taskList and DOM (title, date)
        const {newTitle, newDate, newDescription} = getEditTaskData();
        if (task.constructor === Task && newDescription === "") {
            // Edit Task instance
            task.updateTaskList();
            console.log(Task.taskList);
        } else if (task.constructor === Task && newDescription !== "") {
            // Change Task instance to Description instance
            // Create new Description instance
            const {newTask} = createDescription();
            // Find index of the previous Task instance
            const index = Description.findTaskIndex(task);
            task.deleteTaskInstance(index);
            // Replace task instance with description instance
            newTask.newEditedList();
            console.log(Task.taskList);
        } else if (task.constructor === Description && newDescription !== "") {
            // Edit Description instance
            task.updateTaskList();
            console.log(Task.taskList);
        } else if (task.constructor === Description && newDescription === "") {
            // WAS A Description INSTANCE, WANTS TO BE A Task INSTANCE
            // Create new Task instance
            const {newTask} = createTaskFromEdit();
            // Find index of the previous Description instance
            const index = Description.findTaskIndex(task);
            task.deleteTaskInstance(index);
            // Replace Description instance with Task instance
            newTask.newEditedList();
            console.log(Task.taskList);
        }
        taskCardToEdit.querySelector(".card-title").innerHTML = newTitle;
        taskCardToEdit.querySelector(".date").innerHTML = newDate;
        // close modal
        editTaskDialog.close(); 
        let getPriority
        Task.taskList.forEach((task) => {
            if (task.id === taskCardId) {
                getPriority = task.priority;
            }
        })
        console.log(taskCardToEdit);
        console.log(getPriority);
        setBorderColour(taskCardToEdit, getPriority);
    } else if (e.target.id === "close-edit-form") {
        e.preventDefault();
        // close modal
        editTaskDialog.close();
    }
})

export function getEditTaskData () {
    const newTitle = document.getElementById("edit-title").value;
    const newDescription = document.getElementById("edit-description").value;
    const newDate = document.getElementById("edit-date").value;
    const newPriority = document.getElementById("edit-priority").value;
    const newProject = document.getElementById("edit-project").value;
    return {newTitle, newDescription, newDate, newPriority, newProject}
}

function setBorderColour (taskCard, priority) {
    if (priority === "High") {
        taskCard.style.backgroundColor = "#F2B8B5";
    } else if (priority === "Medium") {
        taskCard.style.backgroundColor = "#F7E3B5";
    } else {
        taskCard.style.backgroundColor = "#B2DFDB";
    }
}

function refreshPage (projectName) {
    const project = document.querySelectorAll("#projects > .tabs");
    project.forEach((tab) => {
        if (tab.getAttribute("data-project") === projectName) {
            const getTaskProject = tab;
            console.log(getTaskProject);
            getTaskProject.click();
        }
    })
}

function setProjectTitle (currentProjectName) {
    // Set project title
    const headerTitle = document.getElementById("project-name");
    for (let i = 0; i < Project.projectList.length; i++) {
        if (Project.projectList[i].keyName.toString() === currentProjectName) {
            headerTitle.innerHTML = Project.projectList[i][currentProjectName].name;
        }
    }
}

function deleteTaskCard (taskCardId) {
    const taskCards = document.querySelectorAll(".task-card");
    for (let i = 0; i < taskCards.length; i++) {
        for (let i = 0; i < taskCards.length; i++) {
            if (taskCards[i].getAttribute("data-id") === taskCardId) {
                console.log("delete this task");
                taskCards[i].remove();
            }
        }
    }
}