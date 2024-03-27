const input = document.querySelector('.input__text'),
    items = document.querySelector('.tasks__wrapper'),
    btns = document.querySelector('.buttons__inner'),
    btnsFilter = document.querySelectorAll('.buttons__row .buttons__btn');

let todos = JSON.parse(localStorage.getItem('todo-list'));

btnsFilter[0].classList.add('active');

function taskDone(task, id) {
    if (task.checked) {
        task.nextElementSibling.classList.add('checked');
        todos[id].status = "completed";
    } else {
        task.nextElementSibling.classList.remove('checked');
        todos[id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function clearAll() {
    document.querySelector('.tasks__wrapper').innerHTML = "";
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function addTask() {
    document.querySelector('.tasks__wrapper').textContent = '';
    if (todos) {
        todos.forEach((todo, id) => {
            const element = document.createElement('li');
            element.classList.add('tasks__inner');
            element.setAttribute('id', id);

            let completed = todo.status == "completed" ? "checked" : "";

            element.innerHTML = `
            <label class="tasks__task">
                <input type="checkbox" ${completed}>
                <p class="task__item ${completed}">${todo.name}</p>
            </label>
            <button class="options"></button>
            `;
            document.querySelector('.tasks__wrapper').append(element);
        })
    }

    input.value = '';
}
addTask();


function sortFilter(data) {

    const allTasks = document.querySelectorAll('.task__item');

    allTasks.forEach((item) => {
        item.parentElement.parentElement.style.display = 'none';
    })

    if (data.filter === 'unDone') {
        allTasks.forEach((item) => {
            if (item.classList.contains('checked')) {
                item.parentElement.parentElement.style.display = 'none';
                return
            }
            item.parentElement.parentElement.style.display = '';
        })
    }

    if (data.filter === 'done') {
        allTasks.forEach((item) => {
            if (!item.classList.contains('checked')) {
                item.parentElement.parentElement.style.display = 'none';
                return
            }
            item.parentElement.parentElement.style.display = '';
        })
    }

    if (data.filter === 'all') {
        allTasks.forEach((item) => {
            item.parentElement.parentElement.style.display = '';
        })
    }
}

function deleteBtn(value, deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    value.remove();
}

input.addEventListener('keydown', event => {
    if (event.key != 'Enter') return

    const value = event.target.value;

    if (value == '') return

    let userTask = value.trim();
    todos = !todos ? [] : todos;
    let taskInfo = { name: userTask, status: "pending" };
    todos.push(taskInfo);
    localStorage.setItem('todo-list', JSON.stringify(todos));

    addTask();
});

items.addEventListener('click', event => {
    const noda = event.target.nodeName;
    if (!(noda == 'INPUT') && !(noda == 'BUTTON')) return

    if (noda == 'INPUT') {
        taskDone(event.target, event.target.parentElement.parentElement.id);
    }

    if (noda == 'BUTTON') {
        deleteBtn(event.target.parentElement, event.target.parentElement.id);
    }
});

btns.addEventListener('click', event => {
    const btn = event.target;
    if (!(btn.classList.contains('buttons__btn'))) return

    btnsFilter.forEach(item => {
        item.classList.remove('active');
    })
    btn.classList.add('active');

    if (btn.id) {
        clearAll();
        return
    }

    sortFilter(btn.dataset, event.target);
});