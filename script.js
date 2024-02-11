const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButton = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  //kholase tar hamun aval hamasho return kardim
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
  // const id = Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString();
  // // console.log(id);
  // return id;
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = ""; //poshte sare ham ke alert bede, zire ham nayan, ghabli none beshe va jadide biad
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  //baraye ghesmate filter all, pernding, completed vorudi(data) midim
  //migim agar vorudi(data) dade shod data ro ejra kon, dar gheire in surat todos hamishegi ejra kon
  // const todoList = data ? data : todos;
  const todoList = data || todos; //ya code bala ya in ke agar data nabud todos ejra beshe
  todosBody.innerHTML = "";
  // console.log(todoList);
  // if (todos.length === 0) //sharte true false mide , === 0 tabdil be false mikone , agar ! bezarim behtare va tabdil be false mishe
  //code herfeei tar dar zir:
  //agar todos.length === 0 bashe , false hast va ejra nemishe , pas ! mizarim ke true beshe va ejra beshe
  /* be zabune sade tar mishe goft: agar todos.length vojud nadasht yani === 0 bude , pas false hast va if ejra nemishe
       pas ! mizarim ke true beshe va ejra beshe */
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'> No Task Found! </td></tr>";
    return;
  }
  // console.log(todos);

  todoList.forEach((todo) => {
    //baraye inke bug pish nayad va vaghti ezafe kardim, 2 3 ta baraye harkodum neshun nade
    //baraye inke daghat meghdare akhar ro neshun nade va hame maghadir ro neshun bede (+) mikonim
    todosBody.innerHTML += ` 
        <tr>
            <td> ${todo.task} </td>
            <!-- <td> ${todo.date} ? ${todo.date} : "no date" </td> -->
            <td> ${
              todo.date || "No Date"
            } </td>  <!-- code sade tar, agar avali false bud, pas dovomi ejra mishe -->
            <td> ${todo.completed ? "Completed" : "Pending"} </td>
            <td>
                <button onclick="editHandler('${todo.id}')"> Edit </button>
                <button onclick="toggleTotoHandler('${todo.id}')"> 
                ${
                  todo.completed ? "Undo" : "Do"
                } <!-- obj dar aval false hast, agar anjam nashode bud, pas if true hast va Do miad va bar aks -->
                </button>
                <button onclick="deleteOneTodoHandler('${
                  todo.id
                }')"> Delete </button>
            </td>
        </tr>
        `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    // task: task,  //chun key va value yek name hastan pas faghat key ro minevisim va JS khodesh tashkhis mide
    task,
    date,
    completed: false,
  };
  if (task) {
    //agar task = "", khode be khode false mishe chun == 0 hast
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    // console.log(todos);
    showAlert("Todo added successfully", "success");
  } else {
    // alert("Warning");
    showAlert("Please enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    //agar length vojud dasht yani 1 2 3,... bud
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};

const deleteOneTodoHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id); //todo haee ro bede ke id hashun ba id click shode barabar nabashe
  todos = newTodos; //...hame be gheire in click shode
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
};

const toggleTotoHandler = (id) => {
  // const newTodos = todos.map(todo => {
  //     if (todo.id === id) {
  //         // return {
  //         //     id: todo.id,
  //         //     task: todo.task,
  //         //     date: todo.date,
  //         //     completed: !todo.completed
  //         // };
  //         return {  //(code behtar 1)
  //             ...todo,
  //             completed: !todo.completed
  //         }
  //     } else {
  //         return todo;
  //     }
  // });
  // todos = newTodos; //ke bad az taghirat newTodo, dar const todos asli ham taghirat sabt shavad
  const todo = todos.find((todo) => todo.id === id); //fine() avalin chizi ke peyda kone ro neshun mide va id ha unic hastan
  todo.completed = !todo.completed; //obj refrence type hast, pas inja ke taghir kone, dare obj asli ham taghir dadae mishe
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  // console.log(id)
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  dateInput.value = "";
  taskInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully", "success");
};

const filterHandler = (event) => {
  // console.log(event);
  let filterTodos = null; //mitunim meghdar nadim ama agar null bedim hajme kamtari migire
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.completed === false); //filter pending
      break;
    case "completed":
      filterTodos = todos.filter((todo) => todo.completed === true); //filter completed
      break;
    default:
      filterTodos = todos; //filter all
      break;
  }

  displayTodos(filterTodos);
  // console.log(filterTodos);
};

//dar dadane vorudi data be displayTodos, ba clg gereftan, event ejra mishod chun inja addEventListener hast va event migire
//pas arow func midim ke moshkeli pish nayad mage khodemun inja event bedim va estefade konim (e) => displayTodos(e));
window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButton.forEach((button) => {
  //3ta button begir va ruye 3ta event ro anjam bede
  button.addEventListener("click", filterHandler);
});
