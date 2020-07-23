const {file: File} = require('./dao').schemes;
const fs = require('fs')

function save(name, path, size) {
  return File.create({name, path, size})
  .then(file => file.id)
}

function get(id) {
  return File.findByPk(id, {attributes: {exclude: ['path', 'updatedAt']}})
  .then(file => file)
}

function stream(id) {
  return File.findByPk(id, {attributes: {exclude: ['id', 'createdAt', 'updatedAt']}})
  .then(file => {
    if (!fs.existsSync(`${__dirname}/../../${file.path}`)) return null;
    return {
      name: file.name,
      extension: file.extension,
      mime: file.mime,
      size: file.size,
      stream: fs.createReadStream(`${__dirname}/../../${file.path}`)
    }
  })
}

function getList(limit, offset) {
  offset--;
  offset = offset < 0 ? 0 : offset
  offset *= limit;
  return File.findAndCountAll({limit, offset, attributes: {exclude: ['path', 'updatedAt']}})
}

function update(id, data) {
  return File.findByPk(id, {attributes: ['id', 'path']})
  .then(file => {
    deleteFromStorage(file.path)
    return file.update(data)
  })
  .then(updatedFile => updatedFile.id)
}

function remove(id) {
  return File.findByPk(id, {attributes: ['id', 'path']})
  .then(file => {
    deleteFromStorage(file.path)
    return file.destroy()
  })
  .then(deletedFile => deletedFile.id)
}

function isExist(id) {
  return File.count({where: {id}})
  .then(count => !!count)
}

function deleteFromStorage(path) {
  fs.unlinkSync(`${__dirname}/../../${path}`)
}

module.exports = {
  get,
  getList,
  stream,
  save,
  update,
  remove,
  isExist
}