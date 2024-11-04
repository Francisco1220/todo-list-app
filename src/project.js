export class Project {
    static projectList = [];

    static counter = 1;

    static increment () {
        return this.counter++;
    } 

    constructor(name) {
        const keyName = [`project${Project.increment()}`];
        this.keyName = keyName;
        this[keyName] = {name};
    }

    addProjectToList () {
        Project.projectList.push(this);
    }

    get projectKeyName () {
        return this.keyName;
    }
}