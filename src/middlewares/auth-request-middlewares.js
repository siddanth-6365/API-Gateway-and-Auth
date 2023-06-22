const { StatusCodes } = require("http-status-codes");

const { AppError } = require("../utils");
const { errorResponse } = require("../utils/common");
const { UserService } = require("../services");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    errorResponse.message = "Something went wrong while authenticating user";
    errorResponse.error = new AppError(
      ["Email not found in the incoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  if (!req.body.password) {
    errorResponse.message = "Something went wrong while authenticating user";
    errorResponse.error = new AppError(
      ["password not found in the incoming request in the correct form"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
}

async function checkAuth(req, res, next) {
  try {
    const response = await UserService.isAuthenticated(req.headers["x-access-token"]);

    if (response) {
      req.user = response; // setting the user id in the req object
      next();
    }
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
}

module.exports = {
  validateAuthRequest,
  checkAuth,
};
