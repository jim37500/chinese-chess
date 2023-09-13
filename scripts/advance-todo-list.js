function addNewTodoList() {
  const title = document.querySelector('.js-new-todo-list-name').value;
  const count = todoList.length;
  const id = 'id' + title + count;
  todoList.push({id, title});
  console.log(todoList);
  renderTodoList();
  saveToLocalStorage();
}

function addTodoList(listId, name, date) {
  let matchingList;
  todoList.forEach((list) => {
    if (list.id === listId) {
      matchingList = list;
    };
  });

  let count = 0;
  if (matchingList.content) {
    count = matchingList.content.length;
  }
  const innerId = listId + count;
  
  if (matchingList.content) {
    matchingList.content.push({innerId, name, date});
  } else {
    matchingList.content = [{innerId, name, date}];
  }
  console.log(todoList);
  saveToLocalStorage();
  renderTodoList();
}

function removeTodoList(innerId) {
  let matchinginnerId;
  todoList.forEach((list) => {
    if (list.content) {
      list.content.forEach((thing, index) => {
        if (thing.innerId === innerId) {
          matchinginnerId = innerId;
          console.log(thing)
          list.content.splice(index, 1);
          return;
        }
      });
    }
  });
  renderTodoList();
  saveToLocalStorage();
  console.log(todoList)
}

function removeCurrentTodoList(listId) {
  todoList.forEach((list, index) => {
    if (list.id === listId) {
      todoList.splice(index, 1);
      return;
    };
  });
  renderTodoList();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function renderTodoList() {
  let mainHTML = '';
  todoList.forEach((list) => {
    mainHTML += `
    <div class="todo-list-container">
      <div class="todo-list-title">
        ${list.title}
      </div>

      <div class="todo-list-input-container">
        <div></div>
        <input class="todo-list-thing js-todo-list-thing js-todo-list-thing-${list.id}" data-list-id="${list.id}" type="text" placeholder="Todo-list">
        <input class="todo-list-date js-todo-list-date-${list.id}" type="date">
        <button class="add-todo-list-button js-add-todo-list-button" data-list-id="${list.id}">Add</button>
      </div>

      <div class="todo-list-content-container js-todo-list-content-container-${list.id}"></div>
    `;

    let listHTML = '';
    if (list.content) {
    list.content.forEach((thing) => {
      listHTML += `
      <div class="todo-thing-container js-todo-thing-container-${thing.innerId}">
        <input class="todo-list-checkbox" type="checkbox">
        <div class="single-todo-thing">${thing.name}</div>
        <div class="single-todo-due-date">${thing.date}</div>
        <button class="delete-todo-list-button js-delete-todo-list-button" data-inner-id="${thing.innerId}">Delete</button>
      </div>
    `; 
    });
    }
  listsHTML[list.id] = listHTML;

  mainHTML += `
    <button class="delete-current-todo-list js-delete-current-todo-list" data-list-id="${list.id}">
        Delete current todo-list
      </button>
    </div>
    `;
  });

  document.querySelector('.js-main').innerHTML = mainHTML;

  todoList.forEach((list) => {
    document.querySelector(`.js-todo-list-content-container-${list.id}`).innerHTML = listsHTML[list.id];
  });

  document.querySelectorAll('.js-delete-todo-list-button').forEach((button) => {
    button.addEventListener('click', () => {
      const {innerId} = button.dataset;
      console.log(innerId);
      removeTodoList(innerId);
    });
  });

  document.querySelectorAll('.js-add-todo-list-button').forEach((button) => {
    button.addEventListener('click', () =>  {
      const {listId} = button.dataset;
      console.log(listId);
      let name = document.querySelector(`.js-todo-list-thing-${listId}`).value;
      let date = document.querySelector(`.js-todo-list-date-${listId}`).value;
      addTodoList(listId, name, date);
    })
  });

  document.querySelectorAll('.js-todo-list-thing').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      const {listId} = input.dataset;
      if (event.key === 'Enter') {
        let name = document.querySelector(`.js-todo-list-thing-${listId}`).value;
        let date = document.querySelector(`.js-todo-list-date-${listId}`).value;
        addTodoList(listId, name, date);
      };
    });
  });

  document.querySelectorAll('.js-delete-current-todo-list').forEach((button) => {
    button.addEventListener('click', () => {
      const {listId} = button.dataset;
      removeCurrentTodoList(listId);
    });
  });
};


// Main code start from here!!
const todoList = JSON.parse(localStorage.getItem('todoList')) || []; 
let listsHTML = {};
renderTodoList();

document.querySelector('.js-add-new-todo-list-button').addEventListener('click', () => {
  document.querySelector('.js-add-todo-list-container').classList.add('is-adding-todo-list');
});

document.querySelector('.js-confirm-button').addEventListener('click', () => {
  addNewTodoList();
  document.querySelector('.js-add-todo-list-container').classList.remove('is-adding-todo-list');
  document.querySelector('.js-new-todo-list-name').value = '';
});

document.querySelector('.js-cancel-button').addEventListener('click', () => {
  document.querySelector('.js-add-todo-list-container').classList.remove('is-adding-todo-list');
  document.querySelector('.js-new-todo-list-name').value = '';
});

document.querySelector('.js-new-todo-list-name').addEventListener('keydown', (event)=> {
  if (event.key === 'Enter') {
    addNewTodoList();
    document.querySelector('.js-add-todo-list-container').classList. remove('is-adding-todo-list');
    document.querySelector('.js-new-todo-list-name').value = '';
  }
})





