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

async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        console.log("responce of jwt verify :",response)
        const user = await userRepo.get(response.id);
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id; // or we can pass responce.id also
    } catch(error) {
        if(error instanceof AppError) throw error;
        
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
       
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
      
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signin,
    isAuthenticated
}