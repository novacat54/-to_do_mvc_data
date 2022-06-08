const inputElement = document.querySelector('#category');
const listElement = document.querySelector('#items-list');
const clearCompletedButton = document.querySelector('#clear-completed');
const filters = document.querySelector('#filters');
const allItemsButton = document.querySelector('#all');
const activeItemsButton = document.querySelector('#active');
const completedItemsButton = document.querySelector('#completed');
let completed = 0;
let filter_items = 0;
//listElement.children.length
//to move completed -- to checked/unchecked
//classname hidden (no need)
//css with react

const data = [];
let id = 0;

let newInput = (value) => {
    return {
    'selected': false,
    'value': value,
    "id": id
};
}

let addInputToData = (Object) => {
    data.push(Object);
}

let showClearCompleted = () => {
    let isSeledtedElements = data.find(item => item.selected);
    isSeledtedElements ? clearCompletedButton.style.display = 'block' : clearCompletedButton.style.display = 'none';
}

let createLi = (Object) => {
    const li = document.createElement('li');
    li.setAttribute('id', `list-item-${id}`);
    listElement.appendChild(li);
    const div = document.createElement('div');
    li.appendChild(div);
    const input = document.createElement('input');
    input.type = "checkbox";
    input.className = "completed-checkbox";
    div.appendChild(input);
    const label = document.createElement('label');
    div.appendChild(label);
    label.innerHTML = Object.value;
    const destroyButton = document.createElement('button');
    destroyButton.className = "destroy";
    div.appendChild(destroyButton);
}

inputElement.addEventListener('keypress', (event) => {
    if (event.keyCode == 13 && event.target.value != '') {
        let newItem = newInput(event.target.value);
        addInputToData(newItem);
        createLi(newItem);
        id++;
        inputElement.value = null;
        filters.style.display = 'block';
        filter_items ++;
    }
  })


listElement.addEventListener('click', (event) => {
   if (event.target.tagName == 'BUTTON'){
        let itemValue = event.target.parentNode.children[1].innerText;
        let itemClicked = data.find(item => item.value == itemValue);
        document.querySelector(`#list-item-${itemClicked.id}`).remove();
        let indexOfElementToRemove = data.indexOf(itemClicked);
        data.splice(indexOfElementToRemove, 1);
        showClearCompleted();
        showFilter();
   }

    
})

listElement.addEventListener('click', (event) => {
  if (event.target.className == 'completed-checkbox'){
        let itemValue = event.target.parentNode.children[1].innerText;
        let itemClicked = data.find(item => item.value == itemValue);
        itemClicked.selected ? itemClicked.selected = false : itemClicked.selected = true;
        showClearCompleted();
  }
})

clearCompletedButton.addEventListener('click', (event) => {
    for (let i=0; i<data.length; i++){
        if (data[i].selected){
            document.querySelector(`#list-item-${data[i].id}`).remove();
            data.splice(i,1);
            i--;
        }
    }
      clearCompletedButton.style.display = 'none';
      showFilter();
})

listElement.addEventListener('dblclick', (event) => {
  if (event.target.tagName == 'LABEL'){
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
    input.addEventListener('blur', saveToParentAndRemove);
  }
})

allItemsButton.addEventListener('click', (event) => {
    Array.from(listElement.children).forEach(element => element.style.display = 'block');
})

activeItemsButton.addEventListener('click', (event) => {
    for (let item of data){
        item.selected ? document.querySelector(`#list-item-${item.id}`).style.display = 'none' : document.querySelector(`#list-item-${item.id}`).style.display = 'block';
    }
})

completedItemsButton.addEventListener('click', (event) => {
    for (let item of data){
        item.selected ? document.querySelector(`#list-item-${item.id}`).style.display = 'block' : document.querySelector(`#list-item-${item.id}`).style.display = 'none';
    }
})

const saveToParentAndRemove = (event) => {
  if (event.target.parentNode){
    data.find(item => "list-item-"+item.id == event.target.parentNode.parentNode.parentNode.id).value = event.target.value;
    event.target.parentNode.innerHTML = event.target.value;
    event.target.remove();
  }
};

let showFilter = () => {
  if(data.length == 0){
    filters.style.display = 'none';
  }
}

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
