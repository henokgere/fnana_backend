var createError = require('http-errors')
var express = require('express')
var app = express()

var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const initTables = require('./services/data-manip/init-tables')

//controller


//cors
const cors = require('cors')
const corsOptions = {
    // origin:'http://192.168.43.29:3000',
    credentials: true, //access-control-allow-credentials:true
    exposedHeaders: 'token',
    optionSuccessStatus: 204,
}
app.use(cors(corsOptions))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/assets/', express.static(path.join(__dirname, './Assets')))

//routes


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

initTables() //uncomment this to create the tables

module.exports = app
