const mysql = require('mysql2')
const eventEmitter = require('../eventEmitter')

const db = mysql.createConnection({
    host: '127.0.0.1', // = localhost
    user: 'root',
    password: '1234mysql',
    database: 'fnana',
})
db.connect((err) => {
    if (err) {
        console.log('there is an error connecting to database')
        throw err
    }
    console.log(' database connected')
    eventEmitter.emit('db_connected')
})

module.exports = db
