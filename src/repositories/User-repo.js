const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");

const { Users } = require("../models");
const CrudRepository = require("./crud-repo");

class UserRepo extends CrudRepository {
  constructor() {
    super(Users);
  }

}

module.exports = UserRepo;
