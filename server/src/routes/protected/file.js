const router = require('express').Router()
const multer = require('multer')
const upload = multer({dest: 'storage'}).single('filedata')
const file = require('../../models/file')

router.get('/list', (req, res) => {
  let {list_size = '10', page = '1'} = req.query;
  list_size = list_size ? list_size : '10'
  page = page ? page : '1'
  if (/\D/.test(list_size) || /\D/.test(page)) return res.sendStatus(400)
  console.log(req.signedCookies.refresh)
  res.cookie('refresh', 'qweqweqwe', {
    httpOnly: true,
    signed: true
  })
  file.getList(+list_size, +page)
  .then(result => res.send(result))
})

router.get('/download/:id', async (req, res) => {
  const {id} = req.params;
  if (!id || /\D/.test(id) || !await file.isExist(id)) return res.sendStatus(404)
  file.stream(id).then(data => {
    if (!data) return res.sendStatus(410)

    res.setHeader('Content-Type', `${data.mime}; charset=utf-8`)
    res.setHeader('Content-Length', data.size)
    res.setHeader('Content-Disposition', `attachment; filename="${data.name + (data.extension ? ('.' + data.extension) : '')}"`)

    data.stream.on('error', err => res.end(err))
    data.stream.on('open', () => data.stream.pipe(res))
    data.stream.on('close', () => res.end())
  })
})

router.get('/:id', (req, res) => {
  const {id} = req.params;
  if (!id || /\D/.test(id)) return res.sendStatus(404)
  file.get(id).then(file => {
    if (!file) return res.sendStatus(404)
    res.send(file)
  })
  .catch(err => errorHandler(err, res))
})

router.post('/upload', (req, res) => upload(req, res, err => {
  if (err) return res.sendStatus(400)
  const fileData = req.file
  if (!fileData) return res.sendStatus(412)
  file.save(fileData.originalname, fileData.path, fileData.size)
  .then(id => res.send({id}))
  .catch(err => errorHandler(err, res))
}))

router.put('/update/:id', async (req, res) => {
  const {id} = req.params;
  if (!id || /\D/.test(id) || !await file.isExist(id)) return res.sendStatus(404)
  upload(req, res, err => {
    if (err) return res.sendStatus(400)
    const fileData = req.file
    if (!fileData) return res.sendStatus(412)
    file.update(id, {name: fileData.originalname, path: fileData.path, size: fileData.size})
    .then(updated => res.send({updated}))
    .catch(err => errorHandler(err, res))
  })
})

router.delete('/delete/:id', async (req, res) => {
  const {id} = req.params;
  if (!id || /\D/.test(id) || !await file.isExist(id)) return res.sendStatus(404)
  file.remove(id).then(deletedId => res.send({deletedId}))
  .catch(err => errorHandler(err, res))
})

function errorHandler(err, res) {
  console.error(err)
  res.sendStatus(500)
}

module.exports = router;