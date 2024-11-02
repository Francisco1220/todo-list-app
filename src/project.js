export class Project {
    static projectList = [];

    static counter = 1;

    static increment () {
        return this.counter++;
    } 

    constructor(name) {
        const keyName = [`project${Project.increment()}`];
        this.keyName = keyName;
        this[keyName] = {name, id: crypto.randomUUID()};
    }

    addProjectToList () {
        Project.projectList.push(this);
    }

    get projectId() {
        return this[this.keyName].id
    }
}
