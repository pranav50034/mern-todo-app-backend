const { ERR, FALSE, TRUE } = require("../constants");
const {checkUser} = require("../repository/repository.user")

const verifyUsernameEmail = async(email, username) => {
    const userData = await checkUser(email, username);

    if(userData.err) {
        return {ERR, error:userData.err};
    }else if(userData.data) {
        return TRUE;
    }
    return FALSE 
}

module.exports = {verifyUsernameEmail};