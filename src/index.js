// Imported files
import "./style.css";
import {newTask, getTaskInput, createDefault, getEditInputs} from "./dom.js";

// Application Logic goes here (creating new todos, setting todos as complete, changing todo priority)

// Tasks stored as an array of objects
export const taskList = [];

export function checkFormComplete (firstVal, secondVal) {
    const {titleVal, priorityVal} = getTaskInput();
    firstVal = titleVal;
    secondVal = priorityVal;
    let closeDialog = false;
    let alertMessage = "Please make sure you have filled out 'Title' and 'Priority'";
    if (firstVal === "" || secondVal === "default") {
        closeDialog = false;
    } else {
        closeDialog = true;
    }
    return {closeDialog, alertMessage}
}

class Task {
    constructor(title, description, dueDate, priority, project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }
    showTask () {
        console.log(`Title: ${this.title}`);
        console.log(`Description: ${this.description}`);
        console.log(`Due Date: ${this.dueDate}`);
        console.log(`Priority: ${this.priority}`);
        console.log(`Project: ${this.project}`);
    }
}

// Adds task object instances to array
function addTaskToList (...task) {
    for (let i = 0; i < task.length; i++) {
        taskList.push(task[i]);
    }
    console.log(taskList);
}

// Create default task instances
(function createDefaultTasks() {
    const defaultTask1 = new Task("Wash car", "use a mild soap", "2024-10-12", "High", "default");
    const defaultTask2 = new Task("Buy groceries", "Need to buy chicken, eggs, rice, tomatoes, and apples", "2024-10-8", "Medium", "default");
    addTaskToList(defaultTask1);
    addTaskToList(defaultTask2);
    createDefault();
})();

// Dynamically create object instance for every task upon completing task form
export function createTask() {
    const {titleVal, priorityVal, descriptionVal, projectVal, dueDateVal} = getTaskInput();
    addTaskToList(new Task(titleVal, descriptionVal, dueDateVal, priorityVal, projectVal));
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
    return {title, description, project, priority}
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