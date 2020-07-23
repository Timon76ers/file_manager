const {v1: uuid} = require('uuid')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('session', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      unique: true
    },
    exp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    hooks: {
      beforeUpdate: instance => {
        instance.uuid = uuid()
      }
    }
  })
}