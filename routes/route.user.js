const express = require("express");
const { registerUser, loginUser } = require("../controllers/controller.user");
const app = express();

//Register
app.post("/register", registerUser);

//Login
app.post("/login", loginUser)


module.exports = app;