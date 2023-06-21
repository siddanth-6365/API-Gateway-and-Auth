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

module.exports = {
    signup
}