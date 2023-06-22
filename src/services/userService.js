const { StatusCodes } = require('http-status-codes');
const { UserRepo } = require('../repositories');
const {AppError} = require('../utils/index');
const {Auth} =require('../utils/common')

const userRepo = new UserRepo();

async function createUser(data) {
    try {
        const user = await userRepo.create(data);
        return user;
    } catch(error) {
        console.log(error.name);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function signin(data){
    try {
        const user = await userRepo.getUserByemail(data.email);
        console.log("user data :" ,user )

        const passwordMatch = await Auth.checkpassword(data.password,user.dataValues.password)   
        console.log("password match", passwordMatch)

        if(!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        } 
        const jwt = await Auth.createToken( {
            id:user.id,
            email:user.email
        })
        return jwt;
  
      } catch(error){
          console.log(error);
          throw error
      }
}

module.exports = {
    createUser,
    signin
}