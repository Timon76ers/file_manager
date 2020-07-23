const cors = require('cors')
const passport = require('passport')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(passport.initialize())
app.use(require('./routes'))

module.exports = app;