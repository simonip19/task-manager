import { saveTasks, loadTasks } from "./storage.js";

export class Task {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }

    toggle() {
        this.completed = !this.completed;
    }
}

// Closure for private state
export function createTaskManager() {
    let tasks = (loadTasks() || []).map(task => {
        const newTask = new Task(task.title);
        newTask.id = task.id;
        newTask.completed = task.completed;
        return newTask;
    });

    function addTask(title) {
        const task = new Task(title);
        tasks.push(task);
        saveTasks(tasks);
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
    }

    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) task.toggle();
            return task;
        });
        saveTasks(tasks);
    }

    function getTasks() {
        return [...tasks];
    }

    return {
        addTask,
        deleteTask,
        toggleTask,
        getTasks
    };
}
