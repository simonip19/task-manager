import { createTaskManager } from "./taskManager.js";
import { debounce } from "./utils.js";

const manager = createTaskManager();

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const statsDiv = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");

let currentFilter = "all";

function render(searchTerm = "") {
    const tasks = manager.getTasks();

    let filtered = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    if (searchTerm) {
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // If no tasks match the filter or search, show a message
    if (filtered.length === 0) {
        taskList.innerHTML = "<li class='no-tasks'>No tasks found.</li>";
        updateStats(tasks);
        return;
    }

    taskList.innerHTML = filtered.map(task => `
        <li data-id="${task.id}" class="${task.completed ? "completed" : ""}">
            <span>${task.title}</span>
            <div>
                <button class="mark-complete">Mark as completed</button>
                <button class="delete">X</button>
            </div>
        </li>
    `).join("");

    updateStats(tasks);
}

function updateStats(tasks) {
    const stats = tasks.reduce((acc, task) => {
        task.completed ? acc.completed++ : acc.pending++;
        return acc;
    }, { completed: 0, pending: 0 });

    statsDiv.textContent = `Completed: ${stats.completed} | Pending: ${stats.pending}`;
}

addBtn.addEventListener("click", () => {
    if (!taskInput.value.trim()) return;
    manager.addTask(taskInput.value);
    taskInput.value = "";
    render();
});

taskList.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    console.log(id)
    if (e.target.classList.contains("delete")) {
        manager.deleteTask(id);
    }
    else if (e.target.classList.contains("mark-complete")) {
        manager.toggleTask(id);
    }

    render();
});

document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", (event) => {
        event.target.classList.add("active");
        document.querySelectorAll(".filters button").forEach(b => {
            if (b !== event.target) b.classList.remove("active");
        });
        currentFilter = btn.dataset.filter;
        render();
    });
});

searchInput.addEventListener("input",
    debounce(e => render(e.target.value), 300)
);

// Dark mode toggle
(function () {
    render()
    const toggle = document.getElementById("themeToggle");
    toggle.addEventListener("change", (event) => {
        if (event.target.checked) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    });
})();
