const db = require('./databaseConnection')

let validateUnique = (table, type, word) => {
    let sql = 'Select * From ' + table + 'where' + type + '=' + word + ''
    let query = db.query(sql, (err, result) => {
        if (result.length) {
            return false
        } else return true
    })
    return query
}

module.exports = validateUnique
