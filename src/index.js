import {Task, Description, Note} from "./task.js";
import {Project} from "./project.js";
import "./style.css";
import {createCard} from "./dom.js";

export function createProject(name) {
    const newProject = new Project(name);
    newProject.addProjectToList();
    console.log(Project.projectList);
}

export function getProjectTabID() {
    const arr = Project.projectList;
    const id = arr[arr.length - 1].projectId;
    console.log(id);
    return {id}
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




/*
let test = new Task ("Wash clothes", "2024-08-12", "Low", "project1");
console.log(test);
test.addTaskToList();
test.completeTask();
console.log(Task.taskList);

let test2 = new Task ("Wash car", "2025-01-01", "High", "project2");
console.log(test2);
test2.addTaskToList();
console.log(Task.taskList);

let test3 = new Project ("Grocery List");
test3.addProjectToList();
console.log(test3);
console.log(Project.projectList);

let test4 = new Project ("Dinner Recipe");
test4.addProjectToList();
console.log(test4);
console.log(Project.projectList);
console.log(Project.projectList[0].project1);

let test5 = new Project ("Dinner Recipe");
test5.addProjectToList();

console.log(Task.taskList.filter((task) => task.project === "project1"));

const {titleDiv, date} = createCard();
titleDiv.innerHTML = "Test title";
date.innerHTML = "Test date";

const notesTxt = document.getElementById("notes-area");
notesTxt.innerHTML = "* Random text goes here";
*/