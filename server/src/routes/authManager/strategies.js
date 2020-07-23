const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../../models/user')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },(email, password, done) => {
    User.get(email).then(user => {
      if (!user) return done(null, false, {message: 'Нет такого пользователя'})
      if (!user.checkPassword(password)) return done(null, false, {message: 'Не верный пароль'})
      return done(null, {email})
    })
    .catch(err => done(err))
  }
))

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'SECRET'
  }, (payload, done) => {
    const {user, iat, exp} = payload
    if (!user || !iat || !exp) return done(null, false)
    else if (iat > Date.now()) return done(null, false)
    else if (exp < Date.now()) return done(null, false, {message: "Токен устарел"})
    done(null, {email: user})
  }
))