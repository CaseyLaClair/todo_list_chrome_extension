/*
This script.js handles creating, editing, and deleting tasks. 
*/

// Create task array.
var taskArr = [];

/*
The updateView function: updates the view of the task list, getting the previous
tasks from local storage if there are any and appending them. Subsequently called
to update after any action taking by the user.
*/
const updateView = () => {

    const tasksList = document.getElementById("tasksList");

    //Avoids duplication of tasks in list
    var child = tasksList.lastChild;
    while(child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }

    /*
    Cycles through the array taskArr[] and creates a representation
    of each in index.html.
    */
    taskArr.forEach((Element, index) => {

        const newTask = document.createElement("div");
        newTask.setAttribute("class", "task-div");

        const taskText = document.createElement("div");
        taskText.setAttribute("class", Element.isDone ? "task-text task-completed" : "task-text");
        taskText.innerHTML = (index + 1) + ". " + Element.task;

        const taskControls = document.createElement("div");
        taskControls.setAttribute("class", "task-controls");

        const taskEdit = document.createElement("button");
        taskEdit.innerHTML = "Edit";
        taskEdit.setAttribute("id", index + "edit");
        taskEdit.setAttribute("class", "task-btn task-btn-edit");
        taskEdit.addEventListener("click", (event) => editTask(event.target.id));

        const taskDelete = document.createElement("button");
        taskDelete.innerHTML = "Delete";
        taskDelete.setAttribute("id", index + "delete");
        taskDelete.setAttribute("class", "task-btn task-btn-delete");
        taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

        const taskDo = document.createElement("button");
        taskDo.innerHTML = Element.isDone ? "Undo" : "Done";
        taskDo.setAttribute("id", index + "do");
        taskDo.setAttribute("class", "task-btn task-btn-do");
        taskDo.addEventListener("click", (event) => doTask(event.target.id));

        taskControls.appendChild(taskEdit);
        taskControls.appendChild(taskDelete);
        taskControls.appendChild(taskDo);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);

        tasksList.appendChild(newTask);
    });
}

/*
Adds a task to taskArr[] and updates local storage. If empty, it does nothing.
Adds item to view as well and resets input.
*/
const addTask = (isDone) => {

    const task = document.getElementById("task-input").value;
    if(task === null || task.trim() === "") return;
    taskArr.push({task, isDone});
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = "";
}

/*
Edits selected task by removing the original from taskArr[]
and putting the task text in the main input to be edited,
then readded to task list.
*/
const editTask = (id) => {

    const taskIndex = parseInt(id[0]);
    const taskText = taskArr[taskIndex].task;
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = taskText;
}

/*
Removes the task from taskArr[] and updates the view.
*/
const deleteTask = (id) => {

    const taskIndex = parseInt(id[0]);
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

/*
Updates the task in taskArr as being completed. isDone = True
*/
const doTask = (id) => {

    const taskIndex = parseInt(id[0]);
    taskArr[taskIndex].isDone = !taskArr[taskIndex].isDone;
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

/* 
On DOM loading, check if there are any saved tasks
in local storage and add them if there are. 
*/
document.addEventListener("DOMContentLoaded", () => {

    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if(savedTasks !== null) taskArr = [...savedTasks];
    updateView();
})

/* 
When the Add Task button is clicked, call the addTask function 
and add isDone property to false for the submitted task. 
*/
document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));

/*
When the Enter Key is clicked, call the addTask function 
and add isDone property to false for the submitted task. 
*/
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask(false);
    }
});

/*
When the Clear Task button is clicked, clear local storage 
and the task array, then update the view. 
*/
document.getElementById("task-clear-btn").addEventListener("click", () => {

    localStorage.clear();
    taskArr = [];
    updateView();
})

