// Imported files
import "./style.css";
import {newTask, getTaskInput} from "./dom.js";

// Application Logic goes here (creating new todos, setting todos as complete, changing todo priority)

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

// Tasks stored as an array of objects
const taskList = [];

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

// Creates object instance for every task upon completing task form
export function createTask() {
    // Default tasks
    const defaultTask1 = new Task("Wash car", "use a mild soap", "12/10/24", "High", "default");
    const defaultTask2 = new Task("Buy groceries", "Need to buy chicken, eggs, rice, tomatoes, and apples", "8/10/24", "Medium", "default");
    addTaskToList(defaultTask1);
    addTaskToList(defaultTask2);
    // Dynamically created object instances based on user input
    const {titleVal, priorityVal, descriptionVal, projectVal, dueDateVal} = getTaskInput();
    addTaskToList(new Task(titleVal, descriptionVal, dueDateVal, priorityVal, projectVal));
}
