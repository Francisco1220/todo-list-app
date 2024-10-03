
export const newTask = document.querySelector("li:nth-child(6)");
const dialog = document.querySelector("#task-form");
const submitTaskBtn = document.querySelector("#create-task");

newTask.addEventListener("click", () => {
    // opens modal
    dialog.showModal();
})

function checkFormComplete () {
    let title = document.getElementById("title");
    let priority = document.getElementById("priority");
    if (title.value === "" || priority.value === "default") {
        alert("Please make sure you have filled out 'Title' and 'Priority'");
    } else {
        dialog.close();
    }
}

submitTaskBtn.addEventListener("click", (e) => {
    // closes modal
    e.preventDefault();
    // client-side validation (check that inputs are completed)
    checkFormComplete();
})

