export class Task {
    static taskList = [];

    static counter = 1;

    static increment() {
        return this.counter++;
    }
    
    constructor (title, dueDate, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = `project${Task.increment()}`;
        this.completed = false;
    }

    addTaskToList () {
        Task.taskList.push(this);
    }

    completeTask() {
        this.completed = true;
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
}

export class Description extends Task {
    constructor(title, dueDate, priority, project, taskDescription) {
        super(title, dueDate, priority, project);
        this.taskDescription = taskDescription;
    }

    get description () {
        return this.taskDescription;
    }
}

export class Note extends Description {
    constructor(title, dueDate, priority, project, description, taskNote) {
        super(title, dueDate, priority, project, description);
        this.taskNote = taskNote;
    }
    get note () {
        return this.taskNote;
    }
}