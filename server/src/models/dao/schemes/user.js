const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCreate: user => {
        return Promise.resolve()
        .then(() => bcrypt.genSaltSync(10))
        .then(salt => bcrypt.hashSync(user.password, salt))
        .then(hash => user.password = hash)
      }
    }
  })
  User.prototype.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
  }
  return User;
}