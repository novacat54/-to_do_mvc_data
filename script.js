const inputElement = document.querySelector('#category');
const listElement = document.querySelector('#items-list');
const clearCompletedButton = document.querySelector('#clear-completed');
const filters = document.querySelector('#filters');
const allItemsButton = document.querySelector('#all');
const activeItemsButton = document.querySelector('#active');
const completedItemsButton = document.querySelector('#completed');
let state = "ALL";
//listElement.children.length
//to move completed -- to checked/unchecked
//classname hidden (no need)
//css with react

const data = [];
let id = 0;
const newRecord = (value) => {
  return {
    'id': id,
    'value': value,
    'selected': false
  };
};

const addNewRecordToData = (newRecord) => {
  data.push(newRecord);
}

const renderList = () => {
  listElement.innerHTML = null;
  switch (state) {
    case 'ALL':
      for (let i = 0; i < data.length; i++) {
        createLi(data[i]);
      }
      break;

    case 'COMPLETED':
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
  isSeledtedElements ? clearCompletedButton.style.display = 'block' : clearCompletedButton.style.display = 'none';
}

const showFilters = () => {
  data.length == 0 ? filters.style.display = 'none' : filters.style.display = 'block';
}

const createInput = () => {

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
    obj.selected ? obj.selected = false : obj.selected = true;
    renderList();
  }
})

listElement.addEventListener('click', (event) => {
  if (event.target.tagName == 'BUTTON') {
    let elementID = event.target.parentNode.parentNode.getAttribute('id').slice(10);
    let obj = data.find(item => item.id == elementID);
    let indexOfElementToRemove = data.indexOf(obj);
    data.splice(indexOfElementToRemove, 1);
    renderList();
  }
})

clearCompletedButton.addEventListener('click', () => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].selected) {
      data.splice(i, 1);
      i--;
    }
  }
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

const saveToDataAndRender = (event) => {
  if (event.target.parentNode) {
    data.find(item => "list-item-" + item.id == event.target.parentNode.parentNode.parentNode.id).value = event.target.value;
    renderList();
  }
};

// ------------------------------------------------------
// const data = [{object},{object}];

// object ={
//   selected: boolean;
//   value: string;
//   id: number;
// }
// render function 
// create input
// create li
