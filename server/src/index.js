const consola = require('consola')
const app = require('./app')
const httpServer = require('http').createServer(app)
const {synchronization} = require('./models/dao')

const PORT = 3000
const HOST = '0.0.0.0'

httpServer.on('error', err => {
  consola.error({message: err, badge: true})
  httpServer.close()
})

httpServer.on('close', () => {
  consola.warn({message: `Cервер http://${HOST}:${PORT} остановлен`, badge: true})
})

synchronization.then(message => {
  consola.success({message, badge: true})
  httpServer.listen(PORT, HOST, () => {
    consola.success({message: `HTTP сервер слушает порт-${PORT}, на хосте-"${HOST}".`, badge: true})
  });
})
.catch(err => consola.error({message: err, badge: true}))