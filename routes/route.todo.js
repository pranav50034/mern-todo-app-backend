const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createTodo, getTodos, getTodo, completeTodo } = require("../controllers/controller.todo");
const app = express()

app.post("/create-todo", authMiddleware, createTodo);

app.get("/todos", authMiddleware, getTodos)

app.get("/todo", authMiddleware, getTodo)

app.put("/complete-todo", authMiddleware, completeTodo)



module.exports = app
