// DOM related stuff goes here (manipulating DOM, updating UI, handling user inputs)

export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");

newTask.addEventListener("click", () => {
    // opens modal
    dialog.showModal();
})

function checkFormComplete () {
    let titleVal = document.getElementById("title").value;
    let priorityVal = document.getElementById("priority").value;
    if (title === "" || priority === "default") {
        alert("Please make sure you have filled out 'Title' and 'Priority'");
    } else {
        dialog.close();
    }
    return {titleVal, priorityVal}
}


submitTaskBtn.addEventListener("click", (e) => {
    // closes modal
    e.preventDefault();
    // client-side validation (check that inputs are completed)
    checkFormComplete();

    // Get values from each input
    let titleVal = document.getElementById("title").value;
    let descriptionVal = document.getElementById("description").value;
    let dueDate = document.getElementById("date").value;
    let priorityVal = document.getElementById("priority").value;
    let project = document.getElementById("project").value;
    // Return as object the values of each input
    return {titleVal, descriptionVal, dueDate, priorityVal, project}
})

export function getTaskInput () {
    console.log(titleVal);
}
