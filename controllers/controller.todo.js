const joi = require("joi");
const todoSchema = require("../models/model.Todo");
const {
   saveTodo,
   getTodosById,
   getTodobyId,
   updateTodo,
} = require("../repository/repository.todo");
const { ERR } = require("../constants");

const createTodo = async (req, res) => {
   const { task, deadline, priority } = req.body;

   const validationSchema = joi.object({
      task: joi.string().required(),
      deadline: joi.string().required(),
      priority: joi.string().required(),
   });

   const { error } = validationSchema.validate(req.body);

   if (error) {
      return res.status(400).json({
         status: 400,
         message: "Invalid input!",
         error: error.details,
      });
   }

   const todoObj = new todoSchema({
      task,
      deadline,
      priority,
      creator: req.locals.userId,
   });

   const savedTodo = await saveTodo(todoObj);

   if (savedTodo.ERR === ERR) {
      return res.status(500).json({
         status: 500,
         message: "Error creating Todo",
         error: savedTodo.error,
      });
   }

   return res.status(201).json({
      status: 201,
      message: "Todo created successfully!",
      data: {
         task, deadline, priority
      },
   });
};


const getTodos = async (req, res) => {
   let todos = await getTodosById(req.locals.userId);
   if (todos.err) {
      return res.status(500).json({
         status: 500,
         message: "There was an issue retrieving your todos.",
         error: todos.err,
      });
   } else {
      res.status(200).json({
         status: 200,
         data: todos.data,
      });
   }
};

const getTodo = async (req, res) => {
    const todoId = req.body.id;
    const userId = req.locals.userId;
    const todo = await getTodobyId(todoId, userId);

    res.status(200).json({
      status: 200,
      data: todo,
    })
}

const completeTodo = async (req, res) => {
   const todoId = req.body.id;
   const userId = req.locals.userId;
   const todo = await updateTodo(todoId, userId);
   if(todo) {
      const updatedTodo = await getTodobyId(todoId, userId);
      res.status(200).json({
         status: 200,
         message: "Todo updated successfully!",
         data: updatedTodo
      })
   }else {
      res.status(404).json({
         status: 404,
         message: `No todo found with id: ${todoId}`,
      });
   }
   
}

module.exports = { createTodo, getTodos, getTodo, completeTodo };
