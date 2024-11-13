import {Task, Description, Note} from "./task.js";
import {Project} from "./project.js";
import "./style.css";
import {createCard, getTaskFormInputs, getEditTaskData} from "./dom.js";

export function createProject(name) {
    const newProject = new Project(name);
    newProject.addProjectToList();
    console.log(Project.projectList);
}

export function createTask() {
    // Create task (check for description and notes)
    const {titleInput, descriptionInput, dateInput, priorityInput, projectInput} = getTaskFormInputs();
    // Add task to list
    if (descriptionInput === "") {
        const newTask = new Task (titleInput, dateInput, priorityInput, projectInput);
        newTask.addTaskToList();
    } else {
        const newTask = new Description (titleInput, dateInput, priorityInput, projectInput, descriptionInput);
        newTask.addTaskToList();
    }
    console.log(Task.taskList);
}

export function setOptionDataAttr (taskForm, editTaskForm) {
    const arr = Project.projectList;
    const keyName = arr[arr.length - 1].projectKeyName;
    taskForm.setAttribute("data-project", `${keyName}`);
    editTaskForm.setAttribute("data-project", `${keyName}`);
}

export function setProjectTabAttr (tab) {
    const arr = Project.projectList;
    const keyName = arr[arr.length - 1].projectKeyName;
    tab.setAttribute("data-project", keyName);
}

export function updateTaskAsCompleted (id) {
    Task.taskList.filter((task) => {
        if (task.id === id) {
            task.completeTask();
        }
    })
}

export function getDescription (id) {
    // Get description
    let description;
    Task.taskList.filter((task) => {
        if (task.id === id) {
            description = task.description;
        }
    })
    return {description}
}

export function getTaskData (id) {
    let title;
    let description;
    let date;
    let priority;
    let project;
    Task.taskList.filter((task) => {
        if (task.id === id) {
            title = task.taskTitle;
            description = task.taskDescription;
            date = task.taskDueDate;
            priority = task.taskPriority;
            project = task.taskProject;
            console.log(`Project of Selected Task Card: ${project}`);
        }
    });
    return {title, description, date, priority, project}
}

export function findTask (elementId) {
    const task = Task.taskList.find((task) => task.id === elementId);
    return {task}
}

export function createDescription () {
    let newTask;
    const {newTitle, newDescription, newDate, newPriority, newProject} = getEditTaskData();
        if (newDescription !== "") {
            newTask = new Description(newTitle, newDate, newPriority, newProject, newDescription);
        }
        return {newTask}
}

export function createTaskFromEdit () {
    let newTask;
    const {newTitle, newDescription, newDate, newPriority, newProject} = getEditTaskData();
    if (newDescription === "") {
        newTask = new Task(newTitle, newDate, newPriority, newProject);
    }
    return {newTask}
}

export function deleteTask (taskCardId) {
    // Delete task instance
    console.log(taskCardId);
    Task.taskList.filter((task, index) => {
        if (task.id === taskCardId) {
            task.deleteTaskInstance(index);
            console.log(Task.taskList);
        }
    })
}

















// Create the default project and tasks
/* function setDefault () {
    // Create default tasks
    const defaultTask1 = new Task("Do laundry", "2024-08-12", "Low");
    const defaultTask2 = new Task("Buy groceries", "2024-11-29", "High");
    defaultTask1.addTaskToList();
    defaultTask2.addTaskToList(); 
    console.log(Task.taskList);
    // Create default project
    const defaultProject = new Project("Default");
    defaultProject.addProjectToList();
    console.log(Project.projectList);
    
    return {defaultTask1, defaultTask2, defaultProject}
}

setDefault(); */

// Create project and add to projectList