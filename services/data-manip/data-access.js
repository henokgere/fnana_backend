const db = require('./databaseConnection')
const { v4: uuid } = require('uuid')

class DataAccess {
    constructor(table) {
        this.table = table
    }

    create(row) {
        row = { id: uuid(), ...row }
        const query = 'INSERT INTO ' + this.table + ' SET ?'

        return new Promise((resolve) => {
            db.query(query, row, (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Error while inserting data',
                        err,
                    })

                return resolve({
                    message: 'Data inserted successfully',
                    result: row,
                })
            })
        })
    }

    createMany(rows) {
        const columns = ['id', ...Object.keys(rows[0])].join(', ')
        const values = rows
            .map(
                (row) =>
                    `(${[uuid(), ...Object.values(row)]
                        .map((value) => `'${value}'`)
                        .join(', ')})`
            )
            .join(', ')
        const query = `INSERT INTO ${this.table} (${columns}) VALUES ${values}`

        return new Promise((resolve) => {
            db.query(query, (err, result) => {
                if (err) {
                    return resolve({
                        isError: true,
                        message: 'Error while inserting data',
                        err,
                    })
                }

                return resolve({
                    message: 'Data inserted successfully',
                    result,
                })
            })
        })
    }

    updateById(id, data) {
        const query = 'UPDATE ' + this.table + ' SET ? WHERE id = ?'

        return new Promise((resolve) => {
            db.query(query, [data, id], (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Error while updating data',
                        err,
                    })

                return resolve({ message: 'Data updated successfully', result })
            })
        })
    }

    deleteById(id) {
        const query = 'DELETE FROM ' + this.table + ' WHERE id = ?'

        return new Promise((resolve) => {
            db.query(query, id, (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Error while deleting data',
                        err,
                    })

                return resolve({ message: 'Data deleted successfully', result })
            })
        })
    }

    getAll(pageNumber = 1, pageSize = 10) {
        const offset = (pageNumber - 1) * pageSize
        const limit = pageSize
        const query =
            'SELECT * FROM ' + this.table + ' WHERE State = 1 LIMIT ? OFFSET ?'

        return new Promise((resolve) => {
            db.query(query, [limit, offset], (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Error while fetchig data',
                        err,
                    })

                return resolve({ result })
            })
        })
    }

    getById(id) {
        const query = 'SELECT * FROM ' + this.table + ' WHERE id = ?'

        return new Promise((resolve) => {
            db.query(query, id, (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Error while fetching data',
                        err,
                    })

                resolve({ result: result[0] })
            })
        })
    }

    smartQuery(query, values = []) {
        return new Promise((resolve) => {
            db.query(query, values, (err, result) => {
                if (err)
                    return resolve({
                        isError: true,
                        message: 'Something went wrong in your sql syntax',
                        err,
                    })

                return resolve({ result })
            })
        })
    }
}

module.exports = DataAccess
