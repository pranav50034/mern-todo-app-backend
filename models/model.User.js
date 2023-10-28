const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   name: { type: String, required: true },
   username: { type: String, required: true, unique: true },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true }
});

module.exports = mongoose.model("users", UserSchema)
