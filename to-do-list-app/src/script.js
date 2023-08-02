const inputForm = document.getElementById("input-form");
const openModalBtn = document.getElementById("open-modal-button");
const closeModalButton = document.getElementById("close-modal-button");
const modalView = document.getElementById("myModal");
const noTaskMsg = document.getElementById("no-task-msg");

let tasks = [];
let categories = [];

document.addEventListener("DOMContentLoaded", function () {
  updateCategoryList("uncategorized");
  fetchTasks();
});

function openModal() {
  // modalView.style.display = "flex";
  // modalView.style.justifyContent = "center";
  // modalView.style.alignItems = "center";

  modalView.classList.add("modal-open");
  // inputForm.style.display = "flex";
}

function closeModal() {
  modalView.classList.remove("modal-open");
  // modalView.style.display = "none";
  // inputForm.style.display = "none";
}

function fetchTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  console.log(tasks);

  if (tasks == null || tasks.length == 0) {
    tasks = [];
    noTaskMsg.style.display = "block";
    return;
  } else {
    noTaskMsg.style.display = "none";
  }

  for (let i = 0; i < tasks.length; i++) {
    let savedTask = {
      done: tasks[i].done,
      name: tasks[i].name,
      category: tasks[i].category,
      date: tasks[i].date
    };
    updateCategoryList(savedTask.category.toLowerCase());
  }

  displayTasksToList();
}

function saveTasks() {
  let string = JSON.stringify(tasks);
  console.log(string);
  localStorage.setItem("tasks", string);
}

function displayTaskToList(newtask) {
  const tlist = document.getElementById("task-list");

  const insideDiv = document.createElement("div");
  insideDiv.setAttribute("class", "task-details");

  const insideDivDetails = document.createElement("div");
  insideDivDetails.setAttribute("class", "task-inside-details");

  const temp = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = newtask.done;
  if (newtask.done) {
    temp.classList.toggle("donetask");
    saveTasks();
  }

  const title = document.createElement("h3");
  title.setAttribute("class", "title");
  title.textContent = newtask.name;

  const categ = document.createElement("p");
  categ.innerHTML = `<b>Category:&nbsp;</b> ${newtask.category}`;

  const date = document.createElement("p");
  date.innerHTML = `<b>Due:&nbsp;</b> <i class="fa-regular fa-calendar"></i> ${
    newtask.date || "---"
  }`;

  checkbox.addEventListener("change", () => {
    temp.classList.toggle("donetask");
    newtask.done = !newtask.done;
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "<i class='fa-regular fa-trash-can'></i>";
  deleteBtn.classList.add("delete");
  deleteBtn.addEventListener("click", () => {
    deleteTask(newtask);
    tlist.removeChild(temp);
  });

  temp.appendChild(checkbox);
  insideDiv.appendChild(title);
  insideDivDetails.appendChild(categ);
  insideDivDetails.appendChild(date);
  insideDiv.appendChild(insideDivDetails);
  temp.appendChild(insideDiv);
  temp.appendChild(deleteBtn);

  tlist.appendChild(temp);
}

function displayTasksToList() {
  for (let i = 0; i < tasks.length; i++) {
    displayTaskToList(tasks[i]);
  }
}

function deleteTask(dtask) {
  //delete
  tasks.splice(tasks.indexOf(dtask), 1);
  //save
  saveTasks();

  tasks == null || tasks.length == 0
    ? (noTaskMsg.style.display = "block")
    : (noTaskMsg.style.display = "none");
}

function updateCategoryList(category) {
  category = category.toLowerCase();
  if (categories.includes(category) == false) {
    console.log("Add Category");
    categories.push(category.toLowerCase());

    const categList = document.getElementById("task-categories-list");

    const temp = document.createElement("option");
    temp.setAttribute("value", category.toLowerCase());
    categList.appendChild(temp);
  }

  console.log(categories);
}

function addTask(e) {
  e.preventDefault();
  const taskNameInput = document.getElementById("task-name");
  const taskCategoryInput = document.getElementById("task-category");
  const taskDateInput = document.getElementById("task-date");

  //Check inputs
  if (taskNameInput.value.length == 0) {
    alert("Name of the task is required!");
    return;
  }

  const task = {};

  task.done = false;
  task.name = taskNameInput.value;
  task.category = taskCategoryInput.value.toLowerCase() || "uncategorized";
  task.date = taskDateInput.value;
  updateCategoryList(task.category);

  tasks.push(task);
  saveTasks();

  // console.log(tasks);

  tasks == null || tasks.length == 0
    ? (noTaskMsg.style.display = "block")
    : (noTaskMsg.style.display = "none");

  displayTaskToList(task);

  //refresh inputs
  taskNameInput.value = "";
  taskCategoryInput.value = "";
  taskDateInput.value = "";
  closeModal();
}

openModalBtn.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
inputForm.addEventListener("submit", addTask);
