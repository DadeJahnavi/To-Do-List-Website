const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  list.innerHTML = "";
  const filtered = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.dataset.index = index;
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleComplete(${index})">✔</button>
        <button class="delete" onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  addDragEvents();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.push({ text: input.value.trim(), completed: false });
  input.value = "";
  saveTasks();
  renderTasks(currentFilter);
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(currentFilter);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks(currentFilter);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks(currentFilter);
  });
});

let currentFilter = "all";

// DRAG AND DROP
function addDragEvents() {
  let dragStartIndex;

  list.querySelectorAll("li").forEach((item, index) => {
    item.addEventListener("dragstart", () => {
      dragStartIndex = index;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", () => {
      const dragEndIndex = item.dataset.index;
      reorderTasks(dragStartIndex, dragEndIndex);
    });
  });
}

function reorderTasks(from, to) {
  const movedItem = tasks.splice(from, 1)[0];
  tasks.splice(to, 0, movedItem);
  saveTasks();
  renderTasks(currentFilter);
}

// Initial render
renderTasks(currentFilter);
const modeToggle = document.getElementById("mode-toggle");

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  modeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Load theme from localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  modeToggle.textContent = "☀️ Light Mode";
}

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  modeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});
