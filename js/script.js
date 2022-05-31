const todos = [];
const RENDER_EVENT = 'render-todo';
const STORAGE_KEY = 'TODO_APPS';
const SAVED_EVENT = 'saved-todo';

const addTodo = () => {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const makeTodo = (todoObject) => {
    const textTitle = document.createElement('h2');
    textTitle.innerHTML = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerHTML = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', () => {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', () => {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', () => {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;
};

const addTaskToCompleted = (todoId) => {
    // const todoTarget = todos.find((todo) => todo.id === todoId);
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const removeTaskFromCompleted = (todoId) => {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const undoTaskFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const generateId = () => +new Date();

const generateTodoObject = (id, task, timestamp, isCompleted) => ({ id, task, timestamp, isCompleted });

const findTodo = (todoId) => {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
};

const findTodoIndex = (todoId) => {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
};

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
};

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTodo();
    });

    if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, () => {
    // console.log(todos);
    // const uncompletedTodos = todos.filter(todo => !todo.isCompleted);
    // const completedTodos = todos.filter(todo => todo.isCompleted);
    const uncompletedTodoList = document.getElementById('todos');
    const completedTodoList = document.getElementById('completed-todos');

    uncompletedTodoList.innerHTML = '';
    completedTodoList.innerHTML = '';
    // todos.forEach((todo) => uncompletedTodoList.append(makeTodo(todo)));
    // completedTodos.forEach(todo => completedTodoList.append(makeTodo(todo)));
    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompletedTodoList.append(todoElement);
        } else {
            completedTodoList.append(todoElement);
        }
    }

});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Saved', localStorage.getItem(STORAGE_KEY));
});
