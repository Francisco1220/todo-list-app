import chevronSVG from "./assets/icons/chevron-right.svg";
import {createProject, 
        setOptionDataAttr, 
        setProjectTabAttr, 
        updateTaskAsCompleted, 
        getDescription, 
        getTaskData, 
        findTask, 
        createDescription, 
        createTaskFromEdit, 
        deleteTask, 
        deleteProject, 
        createNote,
        createTask,
        findNote,
        validateUserInput,
        setStorage} from "./index.js"
import {Project} from "./project.js";
import {Task, Description} from "./task.js";
import {format} from "date-fns";
import {Note} from "./note.js";

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
        clearMain();
        completedTab();
        document.getElementById("edit-notes-btn").style.opacity = "0%";
        document.getElementById("project-name").innerHTML = "Completed Tasks";
        document.getElementById("notes-area").innerHTML = "";
        document.getElementById("delete-project").remove();
    }
})

// Creates a new project when create button clicked
function createNewProject () {
    let projectInput;
    document.getElementById("create-project").addEventListener("click", (e) => {
        e.preventDefault();
        projectInput = document.getElementById("new-project-name").value;
        const {projectFormError} = validateUserInput("Create Project");
        if (projectFormError === false) {
            createProject(projectInput);
            createProjectTab(projectInput);
            // Add project as selectable option in task form
            const {taskOption, editTaskOption} = addProjectOption(projectInput);
            // Set option of task form and edit task form with data attribute of project value
            setOptionDataAttr(taskOption, editTaskOption);
            newProjectDialog.close();
            document.getElementById("project-form").reset();
            setStorage();
        }
    })
}

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


document.getElementById("close-project-form").addEventListener("click", (e) => {
    e.preventDefault();
    newProjectDialog.close();
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
    console.log(tabLi);
    setProjectTabAttr(tabLi);
    tabIcon.insertAdjacentElement("afterend", tabLi);
}

function createNewTask () {
    const {projectInput} = getTaskFormInputs();
    createTask();
    setStorage();
    newTaskDialog.close();
    document.getElementById("task-form").reset();
    refreshPage(projectInput);
}

document.getElementById("task-form-btns").addEventListener("click", (e) => {
    if (e.target.id === "create-task") {
        e.preventDefault();
        const {taskFormError} = validateUserInput("Create Task");
        if (taskFormError === false) {
            createNewTask();
            newTaskDialog.close();
            document.getElementById("task-form").reset();
        } 
    } else if (e.target.className === "close-form") {
        e.preventDefault();
        newTaskDialog.close();
        document.getElementById("task-form").reset();
    }
})

// Gets inputs from taskForm
export function getTaskFormInputs () {
    const titleInput = document.getElementById("title").value
    const descriptionInput = document.getElementById("description").value;
    const dateInput = document.getElementById("date").value;
    const priorityInput = document.getElementById("priority").value;
    const projectIndex = document.getElementById("project").selectedIndex;
    const projectInput = project[projectIndex].getAttribute("data-project");
    return {titleInput, descriptionInput, dateInput, priorityInput, projectInput}
}

let currentProject;

function setCurrentProject () {
    document.getElementById("projects").addEventListener("click", (e) => {
        if (e.target.nodeName === "LI") {
            document.getElementById("edit-notes-btn").style.opacity = "100%";
            console.log(e.target);
            if (!document.getElementById("delete-project")) {
                const deleteProject = document.createElement("button");
                deleteProject.setAttribute("id", "delete-project");
                deleteProject.innerHTML = "Delete Project";
                document.getElementById("header").appendChild(deleteProject);
                deleteProjectBtn();
            }
            clearMain();
            // Create task cards for current selected project tab. Filter taskList for 'project' key
            currentProject = e.target.getAttribute("data-project");
            console.log(currentProject);
            console.log(Task.taskList);
            console.log(Project.projectList);
            const projectTasks = Task.taskList.filter((task) => task.project === currentProject && task.completed === false);
            console.log(projectTasks);
            for (let i = 0; i < projectTasks.length; i++) {
                const {cardDiv, titleDiv, date} = createCard();
                titleDiv.innerHTML = projectTasks[i].title;
                const {newDateFormat} = formatDate(projectTasks[i].dueDate);
                date.innerHTML = `Due by ${newDateFormat}`;
                const id = projectTasks[i].id;
                cardDiv.setAttribute("data-id", id);
                setBorderColour(cardDiv, projectTasks[i].priority);
            }
             setProjectTitle(currentProject);
        }
        showCurrentTab();
        manageTaskCardUI();
        showNote();
        checkNoteExists();
    })
}

// Clears all task cards when called
function clearMain() {
    if (document.getElementById("completed-message")) {
        document.getElementById("completed-message").remove();
    }
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
            trueCount++;
            const {cardDiv, titleDiv, date, checkDiv, editTaskBtn, descriptionBtn, deleteTaskBtn} = createCard();
            titleDiv.innerHTML = task.title;
            const {newDateFormat} = formatDate(task.dueDate);
            date.innerHTML = `Due by ${newDateFormat}`;
            setBorderColour(cardDiv, task.priority);
            // Custom styles for completed tasks
            titleDiv.setAttribute("class", "card-title strikethrough");
            checkDiv.setAttribute("data-check-svg", "");
            date.setAttribute("class", "date strikethrough");
            editTaskBtn.style.opacity = "0.2";
            descriptionBtn.style.opacity = "0.2";
            deleteTaskBtn.style.opacity = "0.2";
            // Disable all click/hover events
            checkDiv.style["pointer-events"] = "none";
            editTaskBtn.style["pointer-events"] = "none";
            descriptionBtn.style["pointer-events"] = "none";
            deleteTaskBtn.style["pointer-events"] = "none";
        }
    })
    if (trueCount === 0) {
        noCompletedMessage();
    }
}

function noCompletedMessage () {
    const tasksContainer = document.getElementById("tasks-container");
    const p = document.createElement("p");
    p.innerHTML = "No Tasks Completed Yet";
    p.setAttribute("id", "completed-message");
    tasksContainer.appendChild(p);
}

let taskCardToEdit;

function manageTaskCardUI () {
    const taskCards = document.querySelectorAll(".task-card");
        for (let i = 0; i < taskCards.length; i++) {
            taskCards[i].addEventListener("click", (e) => {
                if (e.target.className === "circle-check") {
                    const taskComplete = e.target.parentElement;
                    const taskId = e.target.parentElement.getAttribute("data-id");
                    taskComplete.remove();
                    updateTaskAsCompleted(taskId);
                    setStorage();
                } else if (e.target.className === "descriptionBtn") {
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
                    deleteTask(taskId);
                    deleteTaskCard(taskId);
                    setStorage();
                }
            })
        }
}

function showDescription (id) {
    const {description} = getDescription(id);
    // Populate modal with text (if any description exists)
    const textBox = document.querySelector("#description-modal > div");
    if (description === undefined) {
        alert("No description to show");
    } else {
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

// Submit edited task
document.getElementById("edit-form-btns").addEventListener("click", (e) => {
    if (e.target.id === "edit-task") {
        e.preventDefault();
        // Update taskList and DOM (title, date)
        const {editTaskError} = validateUserInput("Edit Task");
        if (editTaskError === false) {
            const taskCardId = taskCardToEdit.getAttribute("data-id");
            const {task} = findTask(taskCardId);
            const {newTitle, newDate, newDescription} = getEditTaskData();
            if (task.constructor === Task && newDescription === "") {
                // Edit Task instance
                task.updateTaskList();
                setStorage();
            } else if (task.constructor === Task && newDescription !== "") {
                // Change Task instance to Description instance
                // Create new Description instance
                const {newTask} = createDescription();
                // Find index of the previous Task instance
                const index = Description.findTaskIndex(task);
                task.deleteTaskInstance(index);
                // Replace task instance with description instance
                newTask.newEditedList();
                setStorage();
            } else if (task.constructor === Description && newDescription !== "") {
                // Edit Description instance
                task.updateTaskList();
                setStorage();
            } else if (task.constructor === Description && newDescription === "") {
                // Change Description instance to Task instance
                // Create new Task instance
                const {newTask} = createTaskFromEdit();
                // Find index of the previous Description instance
                const index = Description.findTaskIndex(task);
                task.deleteTaskInstance(index);
                // Replace Description instance with Task instance
                newTask.newEditedList();
                setStorage();
            }
            taskCardToEdit.querySelector(".card-title").innerHTML = newTitle;
            taskCardToEdit.querySelector(".date").innerHTML = newDate;
            editTaskDialog.close(); 
            let getPriority
            Task.taskList.forEach((task) => {
                if (task.id === taskCardId) {
                    getPriority = task.priority;
                }
            })
            setBorderColour(taskCardToEdit, getPriority);
        } else if (e.target.id === "close-edit-form") {
            e.preventDefault();
            editTaskDialog.close();
        }
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

function setProjectTitle(currentProjectName) {
    const headerTitle = document.getElementById("project-name");
    for (let i = 0; i < Project.projectList.length; i++) {
        if (Project.projectList[i].keyName.toString() === currentProjectName) {
            headerTitle.innerHTML = Project.projectList[i][currentProjectName].name;
            headerTitle.setAttribute("data-project", Project.projectList[i].keyName);
        }
    }
}

function deleteTaskCard (taskCardId) {
    const taskCards = document.querySelectorAll(".task-card");
    for (let i = 0; i < taskCards.length; i++) {
        for (let i = 0; i < taskCards.length; i++) {
            if (taskCards[i].getAttribute("data-id") === taskCardId) {
                taskCards[i].remove();
            }
        }
    }
}

function formatDate(date) {
    const dateArr = date.split("-");
    let year = dateArr[0];
    let month = dateArr[1] - 1;
    let day = dateArr[2];
    const dateObj = new Date(year, month, day);
    const newDateFormat = format(dateObj, 'PPPP');
    return {newDateFormat};
}

function deleteProjectBtn () {
    document.getElementById("delete-project").addEventListener("click", () => {
        const project = document.getElementById("project-name").getAttribute("data-project");
        if (currentProject === "project1") {
            alert("Default project 'Chores' cannot be deleted");
        } else {
            clearMain();
            const projectsLi = document.querySelectorAll("#projects > .tabs");
            const projectsIcon = document.querySelectorAll("#projects > .tab-icon");
            for (let i = 0; i < projectsLi.length; i++) {
                if (projectsLi[i].getAttribute("data-project") === project) {
                    projectsLi[i].remove();
                    projectsIcon[i].remove();
                }
            }
            deleteProject(project);
            refreshPage(Project.projectList[0].keyName.toString());
            setStorage();
        }
    })
}

// Notes button (opens modal)
document.getElementById("new-note").addEventListener("click", () => {
    document.getElementById("notes-dialog").showModal();
    const formLabel = document.querySelector("#notes-form > label");
    let currentProjectName;
    Project.projectList.find((folder) => {
        if (folder[currentProject]) {
            currentProjectName = folder[currentProject].name;
        }
    });
    formLabel.innerHTML = `Note for ${currentProjectName} List:`;
})

// Create note when button clicked
document.getElementById("create-note-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const {noteFormError} = validateUserInput("Create Note");
    if (noteFormError === false) {
        const userInput = document.getElementById("note-text").value;
        createNote(currentProject, userInput);
        document.getElementById("notes-dialog").close();
        refreshPage(currentProject);
        setStorage();
    }
})

document.getElementById("close-notes-form").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("notes-dialog").close();
    document.getElementById("notes-form").reset();
})

function showNote () {
    document.getElementById("notes-area").innerHTML = "";
    let projectNote;
    Note.noteList.find((note) => {
        if (note.project === currentProject) {
            projectNote = note.taskNote;
            document.getElementById("notes-area").innerHTML = projectNote;
        } 
    })
    return {projectNote}
}

export function getEditedNote () {
    const editedTaskNote = document.getElementById("edit-note-text").value;
    return {editedTaskNote}
}

// Open form to edit note
document.getElementById("edit-notes-btn").addEventListener("click", () => {
    document.getElementById("edit-note-dialog").showModal();
    const {note} = findNote(currentProject);
    document.querySelector("#edit-note-form > label").innerHTML = Project.projectList.find((project) => project[currentProject])[currentProject].name;
    if (note !== undefined) {
        document.getElementById("edit-note-text").innerHTML = note.note;
    }
})

// Submit updatedNote
document.getElementById("edit-note").addEventListener("click", (e) => {
    e.preventDefault();
    const {editNoteError} = validateUserInput("Edit Note");
    if (editNoteError === false) {
        document.getElementById("edit-note-dialog").close();
        const {note} = findNote(currentProject);
        note.updateNoteList();
        refreshPage(currentProject);
        setStorage();
    }
})

function setDefault() {
    createProjectTab(Project.projectList[0].project1.name);
    setProjectTitle(Project.projectList[0].keyName.toString());
    const {taskOption, editTaskOption} = addProjectOption (Project.projectList[0].project1.name);
    setOptionDataAttr(taskOption, editTaskOption);
    refreshPage(Project.projectList[0].keyName.toString());
}

function checkNoteExists () {
    const {note} = findNote(currentProject);
    if (note === undefined) {
        document.getElementById("edit-notes-btn").style.opacity = "0%"
        document.getElementById("edit-notes-btn").disabled = true;
    } else {
        document.getElementById("edit-notes-btn").style.opacity = "100%"
        document.getElementById("edit-notes-btn").disabled = false;
    }
}

// Shows user which project tab is currently selected (by making font bold)
function showCurrentTab () {
        document.querySelector(".ul-item").style.fontWeight = "normal";
        const projectTabs = document.querySelectorAll("#projects > li");
        projectTabs.forEach((tab) => {
            if (tab.dataset.project === currentProject) {
                tab.style.fontWeight = "500";
            } else {
                tab.style.fontWeight = "normal";
            }
    })
}

// Shows user whether 'Completed tab' is selected (by making font bold)
document.querySelector(".ul-item").addEventListener("click", (e) => {
    e.target.style.fontWeight = "500";
    const projectTabs = document.querySelectorAll("#projects > li");
    projectTabs.forEach((tab) => {
        if (tab.dataset.project === currentProject) {
            tab.style.fontWeight = "normal";
        }
    });
})


document.addEventListener("DOMContentLoaded", () => {
    setCurrentProject();
    setDefault();
    createNewProject();
    deleteProjectBtn();
    /* const {tasksStored, projectsStored} = getStorage();
    if (tasksStored !== null && projectsStored !== null) {
        
    } */
})

/* 
document.addEventListener("DOMContentLoaded", () => {
    setCurrentProject();
    setDefault();
    createNewProject();
    deleteProjectBtn();
    const {tasksStored, projectsStored} = getStorage();
    if (tasksStored !== null && projectsStored !== null) {
        Task.taskList = tasksStored;
        Project.projectList = projectsStored;
        setCurrentProject();
        for (let i = 0; i < Project.projectList.length; i++) {
            if (Project.projectList[i].keyName.toString() !== "project1") {
                const key = Project.projectList[i].keyName.toString();
                createProjectTab(Project.projectList[i][key].name);
                const {taskOption, editTaskOption} = addProjectOption(Project.projectList[i][key].name);
                setOptionDataAttr(taskOption, editTaskOption);
                
            }
        }
        createNewProject();
        deleteProjectBtn();
    } else {
        console.log("No tasks or projects are stored in localStorage yet");
    }
})
*/