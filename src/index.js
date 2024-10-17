// Imported files
import "./style.css";
import {newTask, getTaskInput, getEditInputs, createDefault} from "./dom.js";

// Application Logic goes here (creating new todos, setting todos as complete, changing todo priority)

// Tasks stored as an array of objects
export const taskList = [];

export function checkFormComplete () {
    const {titleVal, priorityVal, dueDateVal} = getTaskInput();
    let closeDialog = false;
    let alertMessage = 'Please make sure you have filled out "Title", "Priority", and "Due Date"';
    if (titleVal === "" || priorityVal === "default" || dueDateVal === "") {
        closeDialog = false;
    } else {
        closeDialog = true;
    }
    return {closeDialog, alertMessage}
}

class Task {
    constructor(title, description, dueDate, priority, project, completed, notes) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.completed = completed;
        this.notes = notes;
    }
}

// Adds task object instances to array
function addTaskToList (...task) {
    for (let i = 0; i < task.length; i++) {
        taskList.push(task[i]);
    }
}

// Create default task instances
(function createDefaultTasks() {
    const defaultTask1 = new Task("Wash car", "use a mild soap", "2024-10-12", "High", "Default", false);
    const defaultTask2 = new Task("Buy groceries", "Need to buy chicken, eggs, rice, tomatoes, and apples", "2024-10-08", "Medium", "Default", false);
    addTaskToList(defaultTask1);
    addTaskToList(defaultTask2);
    createDefault();
})();

// Dynamically create object instance for every task upon completing task form
export function createTask() {
    const {titleVal, priorityVal, descriptionVal, projectVal, dueDateVal} = getTaskInput();
    addTaskToList(new Task(titleVal, descriptionVal, dueDateVal, priorityVal, projectVal, false));
}

export function deleteFromLibrary(element) {
    for (let i = 0; i < taskList.length; i++) {
        // Compare data attribute with title from taskList
        if (taskList[i].title === element.getAttribute("data-id")) {
            taskList.splice(i, 1);
        }
    }
}

export function getTaskObject(element) {
    let title;
    let description;
    let project;
    let priority;
    let dueDate;
    for (let i = 0; i < taskList.length; i++) {
        // Compare data attribute with title from taskList
        if (taskList[i].title === element.getAttribute("data-id")) {
            title = taskList[i].title;
            description = taskList[i].description;
            project = taskList[i].project;
            priority = taskList[i].priority;
            dueDate = taskList[i].dueDate;
        }
    }
    return {title, description, project, priority, dueDate}
}

export function updateTaskList (element) {
    const {titleVal, descriptionVal, dueDateVal, priorityVal, projectVal} = getEditInputs();
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].title === element.getAttribute("data-id")) {
            taskList[i].title = titleVal;
            taskList[i].description = descriptionVal;
            taskList[i].dueDate = dueDateVal;
            taskList[i].priority = priorityVal;
            taskList[i].project = projectVal;
        }
    }
}

export function updateTaskCompleted (element) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].title === element.getAttribute("data-id")) {
            taskList[i].completed = true;
        }
    }
}

export function getProjectInfo (projectName) {
    let filteredArray = taskList.filter(function(task) {
            return task.project === projectName && task.completed === false;
    });
    return {filteredArray}
}

export function deleteCompleted (element) {
    for(let i = 0; i < taskList.length; i++) {
        if (taskList[i].title === element) {
            taskList.splice(i, 1);
        }
    }
}

export function deleteProject (element) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].project === element) {
            taskList.splice(i, 1);
        }
    }
}