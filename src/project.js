export class Project {
    static projectList = [];

    static counter = 1;

    static increment () {
        return this.counter++;
    } 

    constructor(name) {
        const keyName = [`project${Project.increment()}`];
        this.keyName = keyName;
        this[keyName] = {name, currentProject: false};
    }

    addProjectToList () {
        Project.projectList.push(this);
    }

    deleteProject (index) {
        Project.projectList.splice(index, 1);
    }

    get projectKeyName () {
        return this.keyName;
    }
}