'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    
    static associate(models) {
      this.belongsToMany(models.Users, {through: 'user_roles', as: 'user'});
    }
  }
  Role.init({
    name: {
      type: DataTypes.ENUM({
        values: ['ADMIN', 'CUSTOMER', 'FLIGHT_COMPANY']
      }),
      allowNull: false,
      defaultValue: 'CUSTOMER'
    }
  },
    {
    sequelize,
    modelName: 'Role',
    
  });
  return Role;
};