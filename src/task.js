import {getEditTaskData} from "./dom.js";

export class Task {
    static taskList = [];

    static counter = 1;

    static increment() {
        return this.counter++;
    }

    static index = 0;

    static findTaskInstance (taskInstance) {
        this.index = Task.taskList.findIndex(x => x === taskInstance);
        return this.index;
    }

    newEditedList() {
        Task.taskList.splice(Task.index, 0, this);
    }
    
    constructor (title, dueDate, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.completed = false;
        this.id = crypto.randomUUID();
    }

    addTaskToList () {
        Task.taskList.push(this);
    }

    completeTask() {
        this.completed = true;
    }

    updateTaskList () {
        const {newTitle, newDate, newPriority, newProject} = getEditTaskData();
        this.title = newTitle;
        this.dueDate = newDate;
        this.priority = newPriority;
        this.project = newProject;
    }

    deleteTaskInstance (index) {
        Task.taskList.splice(index, 1);
    }

    get taskTitle () {
        return this.title;
    }

    get taskDueDate () {
        return this.dueDate;
    }

    get taskProject () {
        return this.project;
    }
    
    get taskPriority () {
        return this.priority;
    }

    get taskId () {
        return this.id;
    }

    get isTaskComplete () {
        return this.completed;
    }
    set taskTitle (editedTitle) {
        this.title = editedTitle;
    }
}

export class Description extends Task {
    constructor(title, dueDate, priority, project, taskDescription) {
        super(title, dueDate, priority, project);
        this.taskDescription = taskDescription;
        this.id = crypto.randomUUID();
    }

    static index = 0;

    static findTaskIndex (taskInstance) {
        this.index = Task.taskList.findIndex(x => x === taskInstance);
        return this.index;
    }

    newEditedList() {
        Task.taskList.splice(Description.index, 0, this);
    }

    updateTaskList () {
        const {newTitle, newDate, newPriority, newProject, newDescription} = getEditTaskData();
        this.title = newTitle;
        this.dueDate = newDate;
        this.priority = newPriority;
        this.project = newProject;
        this.taskDescription = newDescription;
    }

    get description () {
        return this.taskDescription;
    }
}