 document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('task-input');
            const addButton = document.getElementById('add-btn');
            const taskList = document.getElementById('task-list');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            let tasks = [];
            
            function addTask() {
                const taskText = taskInput.value.trim();
                
                if (taskText === '') {
                    alert('Por favor, digite uma tarefa!');
                    return;
                }
                
                const task = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };
                
                tasks.push(task);
                taskInput.value = '';
                renderTasks();
                saveTasksToLocalStorage();
            }
            
            function renderTasks(filter = 'all') {
                taskList.innerHTML = '';
                
                let filteredTasks = tasks;
                if (filter === 'active') {
                    filteredTasks = tasks.filter(task => !task.completed);
                } else if (filter === 'completed') {
                    filteredTasks = tasks.filter(task => task.completed);
                }
                
                filteredTasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'task-item';
                    li.dataset.id = task.id;
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed;
                    checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));
                    
                    const span = document.createElement('span');
                    span.className = 'task-text';
                    span.textContent = task.text;
                    if (task.completed) {
                        span.classList.add('completed');
                    }
                    
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-btn';
                    deleteButton.textContent = 'Excluir';
                    deleteButton.addEventListener('click', () => deleteTask(task.id));
                    
                    li.appendChild(checkbox);
                    li.appendChild(span);
                    li.appendChild(deleteButton);
                    
                    taskList.appendChild(li);
                });
            }
            
            function toggleTaskCompleted(id) {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return {...task, completed: !task.completed};
                    }
                    return task;
                });
                
                renderTasks(getCurrentFilter());
                saveTasksToLocalStorage();
            }
            
            function deleteTask(id) {
                tasks = tasks.filter(task => task.id !== id);
                renderTasks(getCurrentFilter());
                saveTasksToLocalStorage();
            }
            
            function getCurrentFilter() {
                const activeFilter = document.querySelector('.filter-btn.active');
                return activeFilter.dataset.filter;
            }
            
            function saveTasksToLocalStorage() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            function loadTasksFromLocalStorage() {
                const storedTasks = localStorage.getItem('tasks');
                if (storedTasks) {
                    tasks = JSON.parse(storedTasks);
                    renderTasks();
                }
            }
            
            addButton.addEventListener('click', addTask);
            
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    renderTasks(this.dataset.filter);
                });
            });
            
            loadTasksFromLocalStorage();
        });