import {Task, Description} from "./task.js";
import {Project} from "./project.js";
import "./style.css";
import {getTaskFormInputs, getEditTaskData, getEditedNote} from "./dom.js";
import {Note} from "./note.js";

export function createProject(name) {
    const newProject = new Project(name);
    newProject.addProjectToList();
}

export function createTask() {
    // Create task (check for description and notes)
    const {titleInput, descriptionInput, dateInput, priorityInput, projectInput} = getTaskFormInputs();
    console.log(projectInput);
        if (descriptionInput === "") {
            console.log(projectInput)
            const newTask = new Task (titleInput, dateInput, priorityInput, projectInput);
            newTask.addTaskToList();
        } else {
            const newTask = new Description (titleInput, dateInput, priorityInput, projectInput, descriptionInput);
            newTask.addTaskToList();
        }
}

export function setOptionDataAttr (taskForm, editTaskForm) {
    const arr = Project.projectList;
    const keyName = arr[arr.length - 1].projectKeyName;
    taskForm.setAttribute("data-project", `${keyName}`);
    editTaskForm.setAttribute("data-project", `${keyName}`);
}

export function setProjectTabAttr (tab) {
    const arr = Project.projectList;
    const keyName = arr[arr.length - 1].keyName.toString();
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
    Task.taskList.filter((task, index) => {
        if (task.id === taskCardId) {
            task.deleteTaskInstance(index);
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
    Note.noteList.forEach((note, index) => {
        if (note.project === projectKey) {
            note.deleteNote(index);
        }
    })
}

export function createNote (project, userNote) {
    const newNote = new Note(project, userNote);
    newNote.addNoteToList();
    return {newNote}
}

export function findNote (currentProject) {
    const note = Note.noteList.find((note) => note.project === currentProject);
    return {note}
}

function createDefault () {
    const defaultProject = new Project ("Chores");
    defaultProject.addProjectToList();
    const defaultTask1 = new Task ("Do laundry", "2024-08-12", "High", "project1");
    const defaultTask2 = new Task ("Buy groceries", "2024-11-29", "Medium", "project1");
    const defaultTask3 = new Task ("Wash dishes", "2024-11-30", "Low", "project1");
    defaultTask1.addTaskToList();
    defaultTask2.addTaskToList(); 
    defaultTask3.addTaskToList();
    const defaultNote = new Note("project1", "Need to buy laundry detergent");
    defaultNote.addNoteToList();
}

createDefault();

export function validateUserInput (formType) {
    let taskFormError = false;
    let projectFormError = false;
    let noteFormError = false;
    let editTaskError = false;
    let editNoteError = false;
    if (formType === "Create Task") {
        const {titleInput, dateInput, priorityInput, projectInput} = getTaskFormInputs();
        if (titleInput === "" || dateInput === "" || priorityInput === "default" || projectInput === "default") {
            alert("Required fields cannot be empty: 'Title', 'Due-Date', 'Priority', 'Choose Project Folder'")
            taskFormError = true;
        }
    } else if (formType === "Create Project") {
        const projectInput = document.getElementById("new-project-name").value;
        if (projectInput === "") {
            alert("Required field cannot be empty");
            projectFormError = true;
        }
    } else if (formType === "Create Note") {
        const userInput = document.getElementById("note-text").value;
        if (userInput === "") {
            alert("Required field cannot be empty");
            noteFormError = true;
        }
    } else if (formType === "Edit Task") {
        const {newTitle, newDate, newPriority, newProject} = getEditTaskData ();
        if (newTitle === "" || newDate === "" || newPriority === "default" || newProject === "default") {
            alert("Required fields cannot be empty: 'Title', 'Due-Date', 'Priority', 'Choose Project Folder'");
            editTaskError = true;
        }
    } else if (formType === "Edit Note") {
        const {editedTaskNote} = getEditedNote();
        if (editedTaskNote === "") {
            alert("Required field cannot be empty");
            editNoteError = true;
        }
    }
    return {taskFormError, projectFormError, noteFormError, editTaskError, editNoteError}
}

export function setStorage() {
    localStorage.setItem("tasks", JSON.stringify(Task.taskList));
    localStorage.setItem("projects", JSON.stringify(Project.projectList));
    localStorage.setItem("notes", JSON.stringify(Note.noteList));
}

/* export function getStorage() {
    const tasksStored = JSON.parse(localStorage.getItem("tasks"));
    const projectsStored = JSON.parse(localStorage.getItem("projects"));
    const notesStored = JSON.parse(localStorage.getItem("notes"));
    return {tasksStored, projectsStored, notesStored}
} */