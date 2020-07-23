const router = require('express').Router()
const {middleware} = require('./authManager')

router.get('/', (req, res) => {
  res.send('Server worked')
});

router.use(require('./sign'))

router.use(middleware.jwt, require('./protected'))

module.exports = router;