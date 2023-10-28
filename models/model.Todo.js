const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Todo = new Schema({
   task: {
      type: String,
      required: false,
   },
   isCompleted: {
      type: Boolean,
      required: false,
      default: false
   },
   timeCreated: { type: Date, default: Date.now(), required: false },
   deadline: {
      type: String,
      required: true,
   },
   priority: {
      type: String,
      required: true,
   },
   creator: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("Todos", Todo);
