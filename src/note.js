import {getEditedNote} from "./dom.js";

export class Note {
    static noteList = [];
    constructor(project, taskNote) {
        this.project = project;
        this.taskNote = taskNote;
    }
    get note () {
        return this.taskNote;
    }

    addNoteToList () {
        Note.noteList.push(this);
    }
    
    getProject () {
        return this.project;
    }

    updateNoteList () {
        const {editedTaskNote} = getEditedNote();
        this.taskNote = editedTaskNote;
    }

    deleteNote (index) {
        Note.noteList.splice(index, 1);
    }
}