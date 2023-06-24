"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {

    static associate(models) {
      this.belongsToMany(models.Role, { through: "user_roles", as: "role" });
    }
  }

  Users.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  Users.beforeCreate(async (user) => {
    const SALT_ROUNDS = 8;
    const encryptedPassword = bcrypt.hashSync(user.password, SALT_ROUNDS);
    user.password = encryptedPassword;
  });

  return Users;
};
