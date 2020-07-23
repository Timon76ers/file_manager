const Sequelize = require('sequelize')
const fs = require('fs')
const schemes = {}

const sequelize = new Sequelize('usersdb', 'root', '12345', {
    host: 'db',
    dialect: 'mysql'
});

fs.readdirSync(`${__dirname}/schemes`)
.forEach(fileName => {
  const schema = require(`./schemes/${fileName}`)(sequelize, Sequelize)
  schemes[schema.name] = schema
})

schemes.user.hasOne(schemes.session, {onDelete: 'cascade'})

const synchronization = sequelize.sync({force: true})
.then(() => {
  return 'Синхронизация с БД mySQL'
})
.catch(err => {
  console.error(err);
  throw `Не удаласть синхонизироваться с БД mySQL`
});

module.exports = {
  synchronization,
  schemes
}