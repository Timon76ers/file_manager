const router = require('express').Router()

router.use('/file', require('./file'))
router.use('/', require('./account'))

module.exports = router;