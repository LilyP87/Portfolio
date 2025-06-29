// Récupération des éléments du DOM
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const filterSelect = document.getElementById("filter-tasks");
const searchInput = document.getElementById("search-input");
const remainingCount = document.getElementById("remaining-count");
const dueDateInput = document.getElementById("due-date"); // ajouté pour éviter null

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Génère un identifiant unique
function generateId() {
  return Date.now().toString();
}

// Met à jour le stockage local et l'affichage
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Met à jour le compteur de tâches restantes
function updateRemainingCount() {
  const count = tasks.filter((task) => !task.completed).length;
  remainingCount.textContent = `${count} tâche(s) restante(s)`;
}

// Crée un élément de tâche
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  li.setAttribute("draggable", true);
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => {
    task.completed = !task.completed;
    saveAndRender();
  });

  const label = document.createElement("label");
  label.textContent = task.text;
  label.addEventListener("dblclick", () => editTask(task, label));

  const dueDate = document.createElement("small");
  dueDate.className = "due-date";
  if (task.dueDate) dueDate.textContent = `⏰ ${task.dueDate}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveAndRender();
  });

  li.append(checkbox, label, dueDate, deleteBtn);
  return li;
}

// Affiche les tâches selon le filtre et la recherche
function renderTasks() {
  taskList.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  let filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm)
  );

  if (filter === "active")
    filteredTasks = filteredTasks.filter((t) => !t.completed);
  if (filter === "completed")
    filteredTasks = filteredTasks.filter((t) => t.completed);

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateRemainingCount();
}

// Ajoute une nouvelle tâche
addTaskButton.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput ? dueDateInput.value : "";
  if (text === "") return;
  const newTask = {
    id: generateId(),
    text,
    completed: false,
    dueDate,
  };
  tasks.push(newTask);
  taskInput.value = "";
  if (dueDateInput) dueDateInput.value = "";
  saveAndRender();
});

// Permet l'édition d'une tâche
function editTask(task, labelElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      task.text = input.value.trim();
      saveAndRender();
    }
  });
  labelElement.replaceWith(input);
  input.focus();
}

// Gère la recherche
searchInput.addEventListener("input", renderTasks);

// Gère les filtres
filterSelect.addEventListener("change", renderTasks);

// Thème sombre/clair avec stockage
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

// Applique le thème sauvegardé
(function applySavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
})();

// Drag & Drop
let draggedId = null;
taskList.addEventListener("dragstart", (e) => {
  draggedId = e.target.dataset.id;
  e.dataTransfer.effectAllowed = "move";
});
taskList.addEventListener("dragover", (e) => e.preventDefault());
taskList.addEventListener("drop", (e) => {
  const targetId = e.target.closest("li")?.dataset.id;
  if (!targetId || draggedId === targetId) return;
  const fromIndex = tasks.findIndex((t) => t.id === draggedId);
  const toIndex = tasks.findIndex((t) => t.id === targetId);
  const moved = tasks.splice(fromIndex, 1)[0];
  tasks.splice(toIndex, 0, moved);
  saveAndRender();
});

// Trie par ordre alphabétique ou date
document.getElementById("sort-select").addEventListener("change", (e) => {
  const type = e.target.value;
  if (type === "alpha") tasks.sort((a, b) => a.text.localeCompare(b.text));
  if (type === "date")
    tasks.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  saveAndRender();
});

// Initialise
saveAndRender();
