const { StatusCodes } = require('http-status-codes');
const { UserRepo,RoleRepo } = require('../repositories');
const {AppError} = require('../utils/index');
const {Auth} =require('../utils/common')

const roleRepo = new RoleRepo();
const userRepo = new UserRepo();

async function createUser(data) {
    try {
        const user = await userRepo.create(data);
        // assigning default role as customer to user at time of signup
        const role = await roleRepo.getRoleByName('CUSTOMER');
        user.addRole(role); // inbuilt function we have ot should be in form of addModelname and Role is model name
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
        return user.id; 
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


async function isAdmin(data) {
    try {
        console.log("data in isAdmin :",data)

        const user = await userRepo.get(data);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepo.getRoleByName('ADMIN');
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
        
    } catch(error) {
    
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoletoUser(data) {
    try {
        console.log("data in addrole :",data)
        const user = await userRepo.get(data.id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if(!role) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isFlightcompany(data) {
    try {

        const user = await userRepo.get(data);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const flightCompanyrole = await roleRepo.getRoleByName('FLIGHT_COMPANY');

        if(!flightCompanyrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(flightCompanyrole);
        
    } catch(error) {
    
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signin,
    isAuthenticated,
    isAdmin,
    addRoletoUser,
    isFlightcompany
  
}