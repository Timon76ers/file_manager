require('./strategies')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const Session = require('../../models/session')
const SESSION_DURATION_IN_HOURS = 1;
const TOKEN_DURATION_IN_MINUTES = 10

async function generateTokens(email) {
  return {
    access_token: generateAccessToken(email),
    refresh_token: await generateRefreshToken(email)
  }
}

function generateAccessToken(user) {
  const iat = Date.now();
  const exp = iat + TOKEN_DURATION_IN_MINUTES * 60 * 1000;
  const access_token = jwt.sign({user, iat, exp}, 'SECRET')
  return {
    value: access_token, 
    exp
  }
}

function generateRefreshToken(userEmail) {
  return Session.start(userEmail, SESSION_DURATION_IN_HOURS)
  .then(token => ({
    value: token.uuid,
    exp: new Date(token.exp).getTime()
  }))
}

function updateTokens(uuid) {
  return Session.update(uuid, SESSION_DURATION_IN_HOURS).then(session => {
    if (!session) return null;
    return {
      access_token: generateAccessToken(session.userEmail),
      refresh_token: {
        value: session.uuid,
        exp: new Date(session.exp).getTime()
      }
    }
  })
}

module.exports = {
  middleware: {
    local: passport.authenticate('local', {session: false}),
    jwt: passport.authenticate('jwt', {session: false})
  },
  generateTokens,
  updateTokens
}