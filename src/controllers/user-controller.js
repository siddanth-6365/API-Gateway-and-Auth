const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');
const { successResponse, errorResponse } = require('../utils/common');



async function signup(req, res) {
    console.log(req.body)
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });
        successResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(successResponse);
    } catch(error) {
        console.log(error);
        errorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(errorResponse);
    }
}

async function signin(req, res) {
    console.log("req body:" , req.body)
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        successResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(successResponse);
    } catch(error) {
        console.log(error);
        errorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(errorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        successResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(successResponse);
    } catch(error) {
        console.log(error);
        errorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(errorResponse);
    }
}



module.exports = {
    signup,
    signin,
    addRoleToUser
   
}