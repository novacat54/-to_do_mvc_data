const inputElement = document.querySelector('#category');
const listElement = document.querySelector('#items-list');
const clearCompletedButton = document.querySelector('#clear-completed');
const filters = document.querySelector('#filters');
const allItemsButton = document.querySelector('#all');
const activeItemsButton = document.querySelector('#active');
const completedItemsButton = document.querySelector('#completed');
let state = "ALL";

// Comments
// 
// Can improve
// * Move localstorage `toDo` to a constant
// * Minor formatting issues
// * Naming. state variable name is not descriptive. Should be `filterState` or something
// * We can store the filter state in the local storage as well. Or if this is not a task we can have it `renderList` argument instaead of global variable
// * Simpler to use forEach instead of `for (let i = 0; i < data.length; i++) {`
// 
// Good parts
// * Mostly the data manipulation, render and event assignments are splitted in the code

window.addEventListener('load', (event) => {
  if (window.localStorage.getItem(`toDo`)) {
    renderList();
  }
});

const data = window.localStorage.getItem(`toDo`) ? JSON.parse(window.localStorage.getItem(`toDo`)) : [];
let id = window.localStorage.getItem(`toDo`) ? data[data.length - 1].id + 1 : 0;
const newRecord = (value) => {
  return {
    'id': id,
    'value': value,
    'selected': false
  };
};

const setDataToLocalStorage = () => {
  window.localStorage.setItem('toDo', JSON.stringify(data));
}

const addNewRecordToData = (newRecord) => {
  data.push(newRecord);
  setDataToLocalStorage();
}

const renderList = () => {
  listElement.innerHTML = null;
  switch (state) {
    case 'ALL':
      // data.forEach(item => createLi(item));
      for (let i = 0; i < data.length; i++) {
        createLi(data[i]);
      }
      break;

    case 'COMPLETED':
      // data.forEach(item => item.selected && createLi(item));
      for (let i = 0; i < data.length; i++) {
        if (data[i].selected) {
          createLi(data[i]);
        }
      }
      break;

    case 'ACTIVE':
      for (let i = 0; i < data.length; i++) {
        if (!data[i].selected) {
          createLi(data[i]);
        }
      }
      break;
  }
  showClearCompleted();
  showFilters();
}

const createLi = (obj) => {
  const li = document.createElement('li');
  li.setAttribute('id', `list-item-${obj.id}`);

  //  better to appendChild after we did all the html work (at the end of this function)
  listElement.appendChild(li);

  let checked = 'checked';
  obj.selected ? checked : checked = '';
  li.innerHTML = `
    <div>
      <input type='checkbox' class='completed-checkbox' ${checked}></input>
      <label>${obj.value}</label>
      <button class='destroy'></button>
    </div>  
    `;
};

const showClearCompleted = () => {
  let isSeledtedElements = data.some(item => item.selected);
  // clearCompletedButton.style.display = isSeledtedElements ? 'block' : 'none'
  isSeledtedElements ? clearCompletedButton.style.display = 'block' : clearCompletedButton.style.display = 'none';
}

const showFilters = () => {
  // filters.style.display = data.length == 0 ? 'none' : 'block';
  data.length == 0 ? filters.style.display = 'none' : filters.style.display = 'block';
}


inputElement.addEventListener('keypress', (event) => {
  if (event.keyCode == 13 && event.target.value != '') {
    addNewRecordToData(newRecord(event.target.value));
    id++;
    event.target.value = null;
    renderList();
  }
})

listElement.addEventListener('click', (event) => {
  if (event.target.className == 'completed-checkbox') {
    let elementID = event.target.parentNode.parentNode.getAttribute('id').slice(10);
    let obj = data.find(item => item.id == elementID);

    // obj.selected = !obj.selected;
    obj.selected ? obj.selected = false : obj.selected = true;
    setDataToLocalStorage();
    renderList();
  }
})

listElement.addEventListener('click', (event) => {
  if (event.target.tagName == 'BUTTON') {
    let elementID = event.target.parentNode.parentNode.getAttribute('id').slice(10);
    let obj = data.find(item => item.id == elementID);
    let indexOfElementToRemove = data.indexOf(obj);
    data.splice(indexOfElementToRemove, 1);
    setDataToLocalStorage();
    renderList();
  }
})

clearCompletedButton.addEventListener('click', () => {
  // data = data.filter(item => !item.selected);
  for (let i = 0; i < data.length; i++) {
    if (data[i].selected) {
      data.splice(i, 1);
      i--;
    }
  }
  setDataToLocalStorage();
  renderList();
})

allItemsButton.addEventListener('click', () => {
  state = "ALL";
  renderList();
})

activeItemsButton.addEventListener('click', (event) => {
  state = "ACTIVE";
  renderList();
})

completedItemsButton.addEventListener('click', (event) => {
  state = "COMPLETED";
  renderList();
})

listElement.addEventListener('dblclick', (event) => {
  // You have the event.target.id here. Better to declare `saveDataAndRender` in this event listener
  
  if (event.target.tagName == 'LABEL') {
    const input = document.createElement('input');
    input.id = "temporary-input";
    const text = event.target.innerText;
    
    event.target.innerText = null;
    event.target.appendChild(input);
    input.value = text;
    document.getElementById("temporary-input").focus();
    input.addEventListener('keypress', (event) => {
      if (event.keyCode == 13) {
        event.target.blur();
      }
    })
    input.addEventListener('blur', saveToDataAndRender);
  }
})

// Check this method naming and try to understand what should it do without checking the code
const saveToDataAndRender = (event) => {
  if (event.target.parentNode) {
    data.find(item => "list-item-" + item.id == event.target.parentNode.parentNode.parentNode.id).value = event.target.value;
    setDataToLocalStorage();
    renderList();
  }
};
