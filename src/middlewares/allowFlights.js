const { StatusCodes } = require("http-status-codes");

const { AppError } = require("../utils");
const { errorResponse } = require("../utils/common");
const { UserService } = require("../services");

async function checkAuth(req, res, next) {
    try {
        console.log("req.method :", req.method);

            console.log("inside middleware checkAuth in allowflight");
            const response = await UserService.isAuthenticated(
                req.headers["x-access-token"]
            ); // will return the id of the user

            if (response) {
                req.user = response; // setting the req.user as user id from responce
                next();
            }
      
    } catch (error) {
        return res.status(error.statusCode).json(error);
    }
}

async function allowupdate(req, res, next) {
    if (req.method === "PATCH") {
        console.log("REq.body :", req.body);
        console.log("inside middleware allowupdate in allowflight");

        const response1 = await UserService.isAdmin(req.user);
        const responce2 = await UserService.isFlightcompany(req.user);

        if (response1 || responce2) {
            console.log("received responce in allowupdate");
            next();
        } else {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "User not authorized for this action" });
        }
    }
    next();
}

module.exports = {
    checkAuth,
    allowupdate,
};
