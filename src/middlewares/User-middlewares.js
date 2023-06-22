const { StatusCodes } = require('http-status-codes');

const {AppError} = require('.././utils')
const {  errorResponse  } = require('../utils/common');

function validateAuthRequest(req, res, next) {
    if(!req.body.email) {
        errorResponse.message = 'Something went wrong while authenticating user';
        errorResponse.error = new AppError(['Email not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
    }
    if(!req.body.password) {
        errorResponse.message = 'Something went wrong while authenticating user';
        errorResponse.error = new AppError(['password not found in the incoming request in the correct form'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
    }
    next();
}

module.exports = {
    validateAuthRequest
}