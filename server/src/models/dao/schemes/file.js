const mime = require('mime')

module.exports = (sequelize, DataType) => {
  return sequelize.define('file', {
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    extension: {
      type: DataType.STRING
    },
    mime: {
      type: DataType.STRING,
    },
    path: {
      type: DataType.STRING,
      allowNull: false
    },
    size: {
      type: DataType.INTEGER,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: instance => {
        mimeCorrect(instance)
      },
      beforeUpdate: instance => {
        mimeCorrect(instance)
      }
    }
  })
}

function mimeCorrect(instance) {
  instance.mime = mime.getType(instance.name)
  if (instance.name.includes('.')) {
    const names = instance.name.split('.')
    instance.extension = names[names.length - 1]
    names.splice(names.length - 1, 1)
    instance.name = names.join('.')
  }
}