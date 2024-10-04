// Imported files
import "./style.css";
import {newTask, getTaskInput} from "./dom.js";

// Application Logic goes here (creating new todos, setting todos as complete, changing todo priority)

export function checkFormComplete (firstVal, secondVal) {
    const {titleVal, priorityVal} = getTaskInput();
    firstVal = titleVal;
    secondVal = priorityVal;
    let closeDialog = false;
    let alertMessage = "Please make sure you have filled out 'Title' and 'Priority'";
    if (firstVal === "" || secondVal === "default") {
        closeDialog = false;
    } else {
        closeDialog = true;
    }
    return {closeDialog, alertMessage}
}