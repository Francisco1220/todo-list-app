import {Task, Description} from "./task.js";
import {Project} from "./project.js";
import "./style.css";
import {createCard, getTaskFormInputs, getEditTaskData} from "./dom.js";
import {Note} from "./note.js";

export function createProject(name) {
    const newProject = new Project(name);
    newProject.addProjectToList();
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

export function deleteProject (projectKey) {
    Task.taskList.forEach((task, index) => {
        if (task.project === projectKey) {
            task.deleteTaskInstance(index);
        }
    })
    Project.projectList.forEach((projectFolder, index) => {
        if (projectFolder.keyName.toString() === projectKey) {
            projectFolder.deleteProject(index);
        }
    })
}

export function createNote (project, userNote) {
    const newNote = new Note(project, userNote);
    console.log(newNote);
    newNote.addNoteToList();
    console.log(Note.noteList);
    return {newNote}
}

export function findNote (currentProject) {
    const note = Note.noteList.find((note) => note.project === currentProject);
    console.log(note);
    return {note}
}

function createDefault () {
    // Create default project
    const defaultProject = new Project ("Chores");
    console.log(defaultProject);
    defaultProject.addProjectToList();
    console.log(Project.projectList);
    // Create default tasks
    const defaultTask1 = new Task ("Do laundry", "2024-08-12", "High", "project1");
    const defaultTask2 = new Task ("Buy groceries", "2024-11-29", "Medium", "project1");
    const defaultTask3 = new Task ("Wash dishes", "2024-11-30", "Low", "project1");
    defaultTask1.addTaskToList();
    defaultTask2.addTaskToList(); 
    defaultTask3.addTaskToList();
    console.log(Task.taskList);
}

createDefault();