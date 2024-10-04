// DOM related stuff goes here (manipulating DOM, updating UI, handling user inputs)

export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");
import {checkFormComplete} from "./index.js"

newTask.addEventListener("click", () => {
    // opens modal
    dialog.showModal();
})

submitTaskBtn.addEventListener("click", (e) => {
    // closes modal
    e.preventDefault();
    // client-side validation (check that inputs are completed)
    getTaskInput();
    checkFormComplete();
    const {closeDialog, alertMessage} = checkFormComplete();
    if (closeDialog === false) {
        alert(alertMessage);
    } else {
        dialog.close();
    }
})

export function getTaskInput () {
    let titleVal = document.getElementById("title").value;
    let descriptionVal = document.getElementById("description").value;
    let dueDateVal = document.getElementById("date").value;
    let priorityVal = document.getElementById("priority").value;
    let projectVal = document.getElementById("project").value
    return {titleVal, descriptionVal, dueDateVal, priorityVal, projectVal}
}
