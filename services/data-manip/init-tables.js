
const db = require('./databaseConnection')
const eventEmitter = require('../eventEmitter')

//models
const userModel = require('../../domains/user/model')

async function checkTableExistence(table) {
    const query = 'SHOW TABLES LIKE ?'

    return new Promise((resolve) => {
        db.query(query, table, (err, result) => {
            if (err) {
                return resolve({
                    isError: true,
                    message: 'Failed to check table existence!',
                    err,
                })
            }

            return resolve({ tableExists: result.length > 0 })
        })
    })
}

async function executeCreateTableQuery(sql) {
    return new Promise((resolve) => {
        db.query(sql, (err, result) => {
            if (err) {
                return resolve({
                    isError: true,
                    message: 'Failed to create table!',
                    err,
                })
            }

            return resolve({ result })
        })
    })
}

async function runCreateTableScripts() {
    const models = [
        { table: 'users', model: userModel },
    ]
    for (let index = 0; index < models.length; index++) {
        const { isError, message, tableExists, err } =
            await checkTableExistence(models[index].table)
        if (isError) {
            console.log(models[index].table, message)
            continue
        }

        if (tableExists) {
            console.log('Table ' + models[index].table + ' already exists')
            continue
        }

        console.log('Creating ' + models[index].table + ' table')
        let sql = models[index].model.createTable()
        const { isError: execError, err: createError } =
            await executeCreateTableQuery(sql)

        if (execError) {
            console.log('Error while creating table ' + models[index].table)
            console.log({ createError })
            break
        } else console.log('Created table: ' + models[index].table)
    }
}

function initTables() {
    eventEmitter.once('db_connected', () => {
        runCreateTableScripts()
    })
}
module.exports = initTables
