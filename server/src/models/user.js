const {user: User} = require('./dao').schemes;

function registration(email, password) {
  return User.create({email, password})
  .then(user => user.email)
}

function get(email) {
  return User.findByPk(email)
}

function isExist(email) {
  return User.count({where: {email}})
  .then(count => !!count)
}

module.exports = {
  registration,
  get,
  isExist
}