let todos = [];

function addTodo() {
  const todoText = document.getElementById('new-todo-input').value;
  const todoDate = document.getElementById('todo-date-input').value;

  if (todoText === '') return;

  const todoItem = {
    text: todoText,
    date: todoDate ? todoDate : 'No Date',
    completed: false,
    addedDate: new Date()
  };

  todos.push(todoItem);
  renderTodos();
  
  // Clear input fields
  document.getElementById('new-todo-input').value = '';
  document.getElementById('todo-date-input').value = '';
}

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  const filterValue = document.getElementById('filter').value;
  const sortValue = document.getElementById('sort').value;

  let filteredTodos = todos;

  // Apply filter
  if (filterValue === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  } else if (filterValue === 'pending') {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  // Apply sort
  if (sortValue === 'due-date') {
    filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === 'added-date') {
    filteredTodos.sort((a, b) => b.addedDate - a.addedDate);
  }

  // Render todos
  filteredTodos.forEach((todo, index) => {
    const newTodoItem = document.createElement('li');
    newTodoItem.className = 'todo-item';
    
    // If the task is completed, add a background color
    if (todo.completed) {
      newTodoItem.style.backgroundColor = '#d4edda';  // Greenish background
    }

    newTodoItem.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleCompleted(${index})">
      <span class="todo-text">${todo.text}</span>
      <span class="todo-date">${todo.date}</span>
      <button class="edit-button" onclick="openEditModal(${index})"><i class="material-icons">edit</i></button>
      <button class="delete-button" onclick="deleteTodo(${index})"><i class="material-icons">delete</i></button>
    `;

    todoList.appendChild(newTodoItem);
  });
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function toggleCompleted(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function openEditModal(index) {
  currentTodoItem = index;
  const todo = todos[index];

  document.getElementById('edit-todo-input').value = todo.text;
  document.getElementById('edit-todo-date').value = todo.date === 'No Date' ? '' : todo.date;

  document.getElementById('editModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEdit() {
  const newTodoText = document.getElementById('edit-todo-input').value;
  const newTodoDate = document.getElementById('edit-todo-date').value;

  if (currentTodoItem !== null) {
    todos[currentTodoItem].text = newTodoText;
    todos[currentTodoItem].date = newTodoDate ? newTodoDate : 'No Date';
  }

  closeModal();
  renderTodos();
} 

// Event listeners for filtering and sorting
document.getElementById('filter').addEventListener('change', renderTodos);
document.getElementById('sort').addEventListener('change', renderTodos);
