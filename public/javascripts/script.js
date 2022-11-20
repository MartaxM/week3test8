if (document.readyState !== "loading") {
  console.log("Document is ready");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document ready after waiting!");
    initializeCode();
  });
}

function initializeCode() {
  const submitDataButton = document.getElementById("submit-data");

  submitDataButton.addEventListener("click", function () {
    const InputName = document.getElementById("input-name");
    const InputTask = document.getElementById("input-task");

    fetch("http://localhost:3000/todo", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body:
        '{ "name": "' +
        InputName.value +
        '" , "task": "' +
        InputTask.value +
        '"}'
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        clientFeedback(data);
      });
  });

  const searchUserButton = document.getElementById("search");

  searchUserButton.addEventListener("click", function () {
    const InputUser = document.getElementById("search-name");
    let user_path = "http://localhost:3000/user/" + InputUser.value;
    //console.log(user_path);
    fetch(user_path, { method: "get" })
      .then((response) => response.json())
      .then((user) => {
        console.log(user);
        showUser(user);
      });
  });
}

function clientFeedback(data) {
  let feedback = document.getElementById("feedback");
  feedback.innerText = data;
}

function showUser(user) {
  let userDiv = document.getElementById("user-info");
  let name = document.createElement("h4");
  name.innerText = user.name;
  if (!user.found) {
    name.setAttribute("style", "color : red");
  }
  userDiv.replaceChildren(name);

  for (let i = 0; i < user.todos.length; i++) {
    let newItem = document.createElement("div");
    let todoText = document.createElement("p");
    todoText.innerText = user.todos[i];
    todoText.setAttribute("style", "display : inline");
    let deTodoButton = document.createElement("button");
    deTodoButton.setAttribute("class", "delete-task");
    deTodoButton.setAttribute("style", "display : inline");
    deTodoButton.innerText = "x";
    deTodoButton.addEventListener("click", () => deleteTodo(user, i));
    newItem.appendChild(todoText);
    newItem.appendChild(deTodoButton);
    userDiv.appendChild(newItem);
  }

  if (user.found) {
    userDiv.appendChild(document.createElement("br"));
    let deleteUserButton = document.createElement("button");
    deleteUserButton.setAttribute("id", "delete-user");
    deleteUserButton.innerText = "Delete user";
    deleteUserButton.addEventListener("click", () => deleteUser(user.name));
    userDiv.appendChild(deleteUserButton);
  }
}

function deleteUser(name) {
  let userDiv = document.getElementById("user-info");
  let user_path = "http://localhost:3000/user/" + name;
  fetch(user_path, {
    method: "delete",
    headers: {
      "Content-type": "application/json"
    }
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      let msg = document.createElement("h4");
      msg.setAttribute("style", "color:red");
      msg.innerText = data;
      userDiv.replaceChildren(msg);
    });
  console.log(name + " deleted");
}

function deleteTodo(user, id) {
  let task_feedback = document.getElementById("task-del-feed");
  fetch("http://localhost:3000/user", {
    method: "put",
    headers: {
      "Content-type": "application/json"
    },
    body: '{ "todo_id": "' + id + '" , "name" : "' + user.name + '"}'
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      task_feedback.innerText = data;
    });
  console.log(user.name + " todo: " + id + " deleted");
}
