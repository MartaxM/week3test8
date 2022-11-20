var express = require("express");
const { userInfo } = require("os");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "My todos" });
});

let todos = [];
router.post("/todo", (req, res) => {
  let obj = {
    name: req.body.name,
    todos: []
  };
  obj.todos.push(req.body.task);

  let indN = searchUser(obj.name);
  /*let indN = -1;
  for (let i = 0; i < todos.length; i++) {
    if(todos[i].name == obj.name){
      indN = i;
    }
  }*/

  let msg;
  if (indN == -1) {
    msg = "User added";
    todos.push(obj);
  } else {
    msg = "Todo added";
    todos[indN].todos = todos[indN].todos.concat(obj.todos);
    obj.todos = todos[indN].todos;
  }

  //res.json(obj);
  console.log(todos);
  res.send(msg);
});

router.get("/user/:id", (req, res) => {
  let userN = searchUser(req.params.id);
  let user = {
    name: req.params.id,
    todos: [],
    found: true
  };

  if (userN == -1) {
    user.name = "User not found";
    user.found = false;
  } else {
    user.todos = todos[userN].todos;
  }

  res.json(user);
});

router.delete("/user/:id", (req, res) => {
  let msg = "User not found";
  let userN = searchUser(req.params.id);
  if (userN != -1) {
    let removed = todos.splice(userN, 1);
    if (removed.length > 0) msg = "User deleted";
  }
  res.send(msg);
});

router.put("/user", (req, res) => {
  let todo_id = req.body.id;
  let userN = searchUser(req.body.name);
  let msg = "User not found";

  if (userN != -1) {
    let removed = todos[userN].todos.splice(todo_id, 1);
    if (removed.length > 0) msg = "Task deleted";
  }

  res.send(msg);
});

function searchUser(name) {
  let indN = -1;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].name == name) {
      indN = i;
    }
  }
  return indN;
}

module.exports = router;
