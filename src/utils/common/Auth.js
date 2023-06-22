const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const ServerConfig = require('../../config/server-config')


 function checkpassword(plainpassword,hashpassword) {
    try {
      console.log("user.password: " ,hashpassword)

      const result =  bcrypt.compareSync(plainpassword, hashpassword); 
      // cant pass data.password or user.password we need declare and pass the password
      // compareSync is an async function no need of callbacks
      // result return true or false
      return result;
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }  

  function createToken(input){
    try {
        // storing jwt secret key and expiry in .env file
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY});
    } catch(error) {
        console.log(error);
        throw error;
    }

  }

  function verifyToken(token) {
    try {
        return jwt.verify(token, ServerConfig.JWT_SECRET);
    } catch(error) {
        console.log(error);
        throw error;
    }
  }

  module.exports = {
    checkpassword,
    createToken,
    verifyToken
  }