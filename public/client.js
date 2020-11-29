// clearButton.addEventListener('click', event => {
//   fetch("/clearDreams", {})
//     .then(res => res.json())
//     .then(response => {
//       console.log("cleared dreams");
//     });
//   dreamsList.innerHTML = "";
// });


/*
  Practical JavaScript Version 12A
  
  Requirements 

  Toggle buttons should be created when a todo is created (similar to the delete buttons)
  Toggle buttons should toggle their respective todos as completed/not completed when clicked
  
  Goal: Create new additions
*/


var todoList = {
  todos: [],
  
  addTodo: function (todoText){
    this.todos.push({
      todoText: todoText,
      completed:false
    });
    view.displayTodos();
    
  },
  
  changeTodo: function (position, newValue){
    this.todos[position].todoText = newValue;
    view.displayTodos();
  },
  
  toggleAll: function(){
    var totalTodos = this.todos.length; 
    var completedTodos = 0; 
    todoList.todos.forEach(function(todo){
      if(todo.completed === true){
        completedTodos++;
      }
      
    })
    todoList.todos.forEach(function(todo){
      if (completedTodos===totalTodos){
        todo.completed = false;
      } else {
        todo.completed = true;
      }
    })
    view.displayTodos();
  }
};


var handlers = {
  addTodoButton: function(){
    var addTodoTextInput = document.getElementById("addTodoTextInput");
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = ""
  },
  deleteTodo: function (position){
    todoList.todos.splice(position,1);
    view.displayTodos();
  },
  changeTodoButton: function(){
    var changeTodoPosition = document.getElementById("changeTodoPosition");
    var changeTodoTextInput = document.getElementById("changeTodoTextInput");
    todoList.changeTodo(changeTodoPosition.valueAsNumber,changeTodoTextInput.value);
    changeTodoPosition.value = "";
    changeTodoTextInput.value="";
  },
  toggleAll: function(){
    todoList.toggleAll();
  },
  toggleCompleted: function(position){
    var todo = todoList.todos[position]; 
    todo.completed = !todo.completed;
    view.displayTodos();
  },
  toggleTodoCompleted: function(){
    var toggleTodoPosition = document.getElementById("toggleTodoPosition");
    todoList.toggleCompleted(toggleTodoPosition.valueAsNumber);
    toggleTodoPosition.value="";
  }
};

//We create a whole new object to just hold the functions related to code related to displaying data
var view = {
  displayTodos: function () {
    var todosUl = document.querySelector('ul'); //locate the 'ul' element in our page
    todosUl.innerHTML = '';                     //clear all the HTML (incl any list items) from the 'ul'
    todoList.todos.forEach(function(todo,position){
      var todoLi = document.createElement('li');
      var todoTextWithCompleted = ''
      if (todo.completed === true){              
        todoTextWithCompleted = "(X) "+ todo.todoText;
      } else {
        todoTextWithCompleted = "( ) "+ todo.todoText;
      }
      todoLi.id = position;
      todoLi.textContent = todoTextWithCompleted;
      todoLi.appendChild(view.createToggleButton());
      todoLi.appendChild(view.createDeleteButton());
      todosUl.appendChild(todoLi);
    })
    
    
  },
  //we create a separate method to create a delete button
  //creates a button element, gives it text 'Delete' and a class. Then returns for use in other elements
  createDeleteButton: function () {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  createToggleButton: function(){
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle';
    toggleButton.className = 'toggleButton';
    return toggleButton
  },
  
  //We create the event listener in this method on the view object (why? for the sake of organization)
   setUpEventListeners: function () {
    var todosUl = document.querySelector('ul');  //we create the event listener ON the surrounding ul to listen for the delete
                                                 //buttons
    todosUl.addEventListener('click',function(event){
      var elementClicked = event.target;
      if (elementClicked.className === "deleteButton"){   //first, we check if a delete button was clicked in the UL byt
                                                          //checking the className on the clicked element
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id)); //if the className tells the computer that the 
                                                          //function is a delete button, we locate the id of its parent
                                                          //(ie the li the delete button is in) and use that as the position
                                                          //for handlers.delteTodoButton. This will delete the correct Todo
      }
    });
  },
  
  setUpToggleListeners: function() {
    var todosUl = document.querySelector('ul');
    todosUl.addEventListener('click',function(event){
      var elementClicked = event.target;
      if (elementClicked.className === "toggleButton"){
        handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
      }
    })
  }
 
}

view.setUpEventListeners(); //After we create this method, we need to call it outside of the object to ensure it runs
view.setUpToggleListeners();