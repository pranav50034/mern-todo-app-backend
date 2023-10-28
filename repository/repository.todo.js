const { TRUE, ERR } = require("../constants");
const todos = require("../models/model.Todo")

const saveTodo = async(todoObj) => {
    try {
        await todoObj.save();
        return TRUE
    } catch (error) {
        return {ERR, error}
    }
}

const getTodosById = async (userId) => {
    let userTodos = todos.find({creator: userId}).then(data => {return {data}}).catch(err => {return {err}})
    return userTodos;
}

const getTodobyId = async (todoId, userId) => {
    let todo = await todos.find({creator: userId, _id: todoId})

    return todo
}

const updateTodo = async (todoId, userId) => {
    const todo = await todos.updateOne({creator: userId, _id: todoId}, {$set : {isCompleted: true}});
    console.log(todo, "repo");

    if(todo.matchedCount==1){
        return true;
    }
    else{
        return false;
    }
}

module.exports = { saveTodo, getTodosById, getTodobyId, updateTodo };