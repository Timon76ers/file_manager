const router = require('express').Router()
const Session = require('../../models/session')

router.get('/info', (req, res) => {
  res.send(req.user.email)
})

router.get('/logout', async (req, res) => {
  const result = Session.stop(req.user.email)
  if (!result) return res.sendStatus(410)
  res.cookie('refresh_token', '', {
    httpOnly: true,
    maxAge: 0
  })
  res.sendStatus(204)
})

module.exports = router;