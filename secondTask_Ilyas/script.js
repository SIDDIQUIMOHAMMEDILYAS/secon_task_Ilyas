document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize the app
    function init() {
        renderTasks();
        updateTaskStats();

        // Add event listeners
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }

    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateTaskStats();

        // Clear input and focus it
        taskInput.value = '';
        taskInput.focus();
    }

    // Render all tasks
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one above!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

            taskList.appendChild(taskItem);

            // Add event listeners to the new task
            const checkbox = taskItem.querySelector('.task-checkbox');
            const taskText = taskItem.querySelector('.task-text');
            const editBtn = taskItem.querySelector('.edit-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            checkbox.addEventListener('change', function () {
                task.completed = this.checked;
                taskText.classList.toggle('completed', this.checked);
                saveTasks();
                updateTaskStats();
            });

            editBtn.addEventListener('click', function () {
                editTask(task, taskText);
            });

            deleteBtn.addEventListener('click', function () {
                deleteTask(task.id);
            });
        });
    }

    // Edit a task
    function editTask(task, taskTextElement) {
        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            taskTextElement.textContent = newText.trim();
            if (task.completed) {
                taskTextElement.classList.add('completed');
            } else {
                taskTextElement.classList.remove('completed');
            }
            saveTasks();
        }
    }

    // Delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskStats();
    }

    // Update task statistics
    function updateTaskStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        totalTasksSpan.textContent = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
        completedTasksSpan.textContent = `${completedTasks} completed`;
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initialize the app
    init();
});