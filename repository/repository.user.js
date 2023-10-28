const users = require("../models/model.User");

const checkUser = async(email, username) => {

    let userData = {
        data: null,
        err: null
    }
    try {
        userData.data = await users.find({$or: [{email}, {username}]});
        if(userData.data.length==0){
            userData.data=null
        }
    } catch (error) {
        userData.err = error;
    }

    return userData;
}

const saveUser = async(user) => {
    await user.save().then((savedUser) => {
        return savedUser
    }).catch((err) => {
        return err
    })
}

const getUserDataWithUsername = async (username) => {

    let userData = {
       data: null,
       err: null,
    };

    try {
       userData.data = await users.find({ username});
       if (userData.data.length == 0) {
          userData.data = null;
       }
    } catch (error) {
       userData.err = error;
    }

    return userData;
}

const getUserDataWithEmail = async (email) => {
    let userData = {
       data: null,
       err: null,
    };

    try {
       userData.data = await users.find({email});
       if (userData.data.length == 0) {
          userData.data = null;
       }
    } catch (error) {
       userData.err = error;
    }

    return userData;
}

module.exports = {
   checkUser,
   saveUser,
   getUserDataWithUsername,
   getUserDataWithEmail,
};