const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { Users } = require("../models");
const CrudRepository = require("./crud-repo");
const { AppError } = require("../utils");
const bcrypt = require('bcrypt')

class UserRepo extends CrudRepository {
  constructor() {
    super(Users);
  }

  async getUserByemail(data) {
    try {
      const user = await Users.findOne({
        where: {
          email: data,
        },
      });
      if (user === null) {
        throw new AppError(
          "user with this email id Not found!",
          StatusCodes.NOT_FOUND
        );
      } else {
        return user;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

 

}

module.exports = UserRepo;
