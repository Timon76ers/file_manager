const {session: Session} = require('./dao').schemes;

function start(userEmail, sessionDuration) {
  const exp = Date.now() + sessionDuration * 60 * 60 * 1000
  return Session.create({userEmail, exp})
}

function stop(userEmail) {
  return Session.destroy({where: {userEmail}})
  .then(rows => !!rows)
}

function update(uuid, sessionDuration) {
  return Session.findOne({where: {uuid}})
  .then(session => {
    const now = Date.now()
    if (!session || new Date(session.exp).getTime() < now) return null
    const exp = now + sessionDuration * 60 * 60 * 1000
    return session.update({exp})
  })
}

module.exports = {
  start,
  stop,
  update
}