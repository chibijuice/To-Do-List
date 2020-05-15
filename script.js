const $form = document.getElementById("form");
const $submit = document.getElementById("submit");
const $input = document.getElementById("input");
const $todoList = document.getElementById("todo-list");
const $editCheck = document.getElementsByClassName("edit-check");
const todoListTemplate = document.getElementById("todo-list-template")
  .innerHTML;
const listItemTemplate = document.getElementById("list-item-template")
  .innerHTML;

let tasks = [];

Handlebars.registerPartial("listItem", listItemTemplate);

// Refresh the template, will have to call it after every action to show changes

function refreshTemplate() {
  const todoTasks = tasks.filter((task) => !task.done);
  const doneTasks = tasks.filter((task) => task.done);
  var template = Handlebars.compile(todoListTemplate);
  $todoList.innerHTML = template({ tasks, todoTasks, doneTasks });
  console.log(tasks);

  // Add event bindings for "click"

  // Toggle done status
  document
    .querySelectorAll(".toggle")
    .forEach((el) => el.addEventListener("click", onToggleClick));

  document
    .querySelectorAll(".task-delete")
    .forEach((el) => el.addEventListener("click", removeTask));

  document
    .querySelectorAll(".edit")
    .forEach((el) => el.addEventListener("click", editClick));

  document
    .querySelectorAll(".edit-check")
    .forEach((el) => el.addEventListener("click", editedTask));

  document
    .querySelectorAll(".edit-input")
    .forEach((el) => el.addEventListener("keydown", editKeydown));
}

function onToggleClick(e) {
  const $li = e.target.parentNode;
  const id = parseInt($li.getAttribute("data-id"));
  let task = tasks.find((task) => task.id === id);
  task.done = !task.done; // Will reverse the true/false
  saveItems();
  refreshTemplate();
}

// Save input

$form.addEventListener("submit", function (e) {
  e.preventDefault(); // (will keep the page from refreshing, which is the default for Enter or Submit button on a form element)

  if ($input.value === "") {
    return;
  }

  tasks.unshift({
    text: $input.value,
    done: false,
    id: +new Date(),
    editing: false,
  });

  // Put the object into storage

  saveItems();

  $input.value = ""; // (clear the text input)
  refreshTemplate();
});

// Save items to Local Storage

function saveItems() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Retrieve the object from storage
tasks = JSON.parse(localStorage.getItem("tasks"));
if (!tasks) {
  tasks = [];
}

refreshTemplate();

// Remove items from storage

function removeTask(e) {
  const $li = e.target.parentNode;
  const id = parseInt($li.getAttribute("data-id"));
  let index = tasks.findIndex((task) => task.id === id);

  tasks.splice(index, 1);

  saveItems();
  refreshTemplate();
}

// Edit button

function editClick(e) {
  const $li = e.target.parentNode;
  const id = parseInt($li.getAttribute("data-id"));
  let task = tasks.find((task) => task.id === id);
  task.editing = !task.editing; // Will reverse the true/false
  saveItems();
  refreshTemplate();
}

// Overwrite edited task

function editedTask(e) {
  const $li = e.target.parentNode;
  const $input = $li.querySelector("input");
  const id = parseInt($li.getAttribute("data-id"));
  let index = tasks.findIndex((task) => task.id === id);

  // const updatedTask = {
  //   ...tasks[index],
  //   text: $input.value,
  //   editing: !tasks[index].editing,
  // };

  // tasks[index] = updatedTask;

  // OR:
  // (overwrites directly in the objects without creating a new object)

  tasks[index].text = $input.value;
  tasks[index].editing = !tasks[index].editing;

  saveItems();
  refreshTemplate();
}

// save input by pressing Enter

function editKeydown(e) {
  if (e.code === "Enter") {
    editedTask(e);
  }
}
