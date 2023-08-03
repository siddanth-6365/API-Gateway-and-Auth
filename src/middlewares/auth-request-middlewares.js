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
    console.log("inside middleware checkAuth ")
    const response = await UserService.isAuthenticated(req.headers["x-access-token"]); // will return the id of the user

    if (response) {
      req.user = response; // setting the req.user as user id from responce
      next();
    }
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
}


async function isAdmin(req, res, next) {
  console.log("inside middleware isAdmin ")

  const response = await UserService.isAdmin(req.user);
  console.log("req.user :" ,req.user)
  if(!response) {
      return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({message: 'User not authorized for this action'});
  }
  next();
}

module.exports = {
  validateAuthRequest,
  checkAuth,
  isAdmin
};
