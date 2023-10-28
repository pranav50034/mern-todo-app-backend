const bcrypt = require("bcrypt");
const userSchema = require("../models/model.User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {
   getUserDataWithEmail,
   getUserDataWithUsername,
} = require("../repository/repository.user");
const { verifyUsernameEmail } = require("../utils/verifyUsernameEmail");
const { FALSE, TRUE } = require("../constants");


const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const registerUser = async (req, res) => {
   const isValid = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().min(3).max(30).alphanum().required(),
      password: Joi.string().min(8).required(),
      email: Joi.string().email().required(),
   }).validate(req.body);

   if (isValid.error) {
      return res.status(400).json({
         status: 400,
         message: "Invalid Input",
         error: isValid.error,
      });
   }

   const userExists = await verifyUsernameEmail(
      req.body.email,
      req.body.username
   );

   if (userExists == TRUE) {
      return res.status(400).json({
         status: 400,
         message: "Email or Username already exists!",
      });
   }

   if (userExists === FALSE) {
      const hashedPassword = bcrypt.hashSync(req.body.password, BCRYPT_SALTS);
      const userObj = new userSchema({
         name: req.body.name,
         username: req.body.username,
         email: req.body.email,
         password: hashedPassword,
      });

      try {
         await userObj.save();
         return res.status(201).json({
            status: 201,
            message: "User Registered Successfully!",
         });
      } catch (err) {
         return res.status(400).json({
            status: 400,
            message: "Error registering user",
            err: err,
         });
      }
   }
   return res.status(400).json({
      status: 400,
      message: "DB error!",
      err: userExists.error,
   });
};

const loginUser = async (req, res) => {
   const { loginId, password } = req.body;

   const isEmail = Joi.object({
      loginId: Joi.string().email().required(),
   }).validate({ loginId });

   let userData;

   if (isEmail.error) {
      const isUsername = Joi.object({
         loginId: Joi.string().required(),
      }).validate({ loginId });

      if (isUsername.error) {
         return res.status(400).json({
            status: 400,
            message: "Invalid Username or Email!",
            error: isUsername.error,
         });
      }

      userData = await getUserDataWithUsername(loginId, password);

      if (userData.err) {
         return res.status(400).json({
            status: 400,
            message: "Error fetching user data with username!",
            error: userData.err,
         });
      }

      if (!userData.data) {
         return res.status(404).json({
            status: 400,
            message: "No user found!",
         });
      }
   } else {
      userData = await getUserDataWithEmail(loginId, password);

      if (userData.err) {
         return res.status(400).json({
            status: 400,
            message: "Error fetching user data with email!",
            error: userData.err,
         });
      }

      if (!userData.data) {
         return res.status(404).json({
            status: 400,
            message: "No user found!",
         });
      }
   }

   try {
      const hashedPassword = userData.data[0].password;
      const isPasswordMatching = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordMatching) {
         return res.status(401).json({
            status: 401,
            message: "Incorrect Password",
         });
      }
   } catch (error) {
      return res.status(500).json({
         status: 500,
         message: "Error in comparing passwords!",
         error: error,
      });
   }

   const payload = {
      username: userData.data[0].username,
      name: userData.data[0].name,
      email: userData.data[0].email,
      userId: userData.data[0]._id,
   };

   const token = jwt.sign(payload, JWT_SECRET_KEY);

   return res.status(200).json({
      status: 200,
      message: "User Logged In Successfully!",
      data: { token },
   });

};

module.exports = { registerUser, loginUser };
