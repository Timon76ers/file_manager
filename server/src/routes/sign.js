const router = require('express').Router()
const User = require('../models/user')
const auth = require('./authManager')

router.post('/signin', auth.middleware.local, async (req, res) => {
  const {email} = req.user;
  const tokens = await auth.generateTokens(email)
  sendTokens(res, tokens)
})

router.post('/signin/new_token', async (req, res) => {
  const {refresh_token} = req.cookies
  if (!refresh_token) return res.sendStatus(400)

  const tokens = await auth.updateTokens(refresh_token)
  if (!tokens) return res.sendStatus(400)

  sendTokens(res, tokens)
})

router.post('/signup', async (req, res) => {
  const {email, password} = req.body
  if (validation(email, password)) return res.sendStatus(400)
  if (await User.isExist(email)) return res.sendStatus(423)
  
  const id = await User.registration(email, password)
  const tokens = await auth.generateTokens(id)
  sendTokens(res, tokens)
})



function sendTokens(res, tokens) {
  res.cookie('refresh_token', tokens.refresh_token.value, {
    httpOnly: true,
    maxAge: tokens.refresh_token.exp - Date.now()
  })
  res.json(tokens)
}

function validation(email, password) {
  return  !email || 
          !password || 
          password.length < 8 ||
          !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

module.exports = router;