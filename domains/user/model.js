const { getCreateTableSQL } = require('../../services/utils/sql')

const userModel = {
    getColumns() {
        const columns = [
            { name: 'id', type: 'VARCHAR(40)', primaryKey: true, nullable: false },
            { name: 'UserName', type: 'VARCHAR(25)', nullable: false,unique: true, },
            { name: 'ProfilePicture', type: 'VARCHAR(25)', nullable: false, default: "'/profiles/avatar.png'" },
            { name: 'PhoneNumber', type: 'VARCHAR(25)' }, 
            { name: 'Email', type: 'VARCHAR(50)' },
            { name: 'VerificationCode', type: 'INT' },
            { name: 'Password', type: 'VARCHAR(72)', nullable: false },
            { name: 'CreatedDate', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
            { name: 'UpdatedDate', type: 'DATETIME' },
            { name: 'DeletedDate', type: 'DATETIME' },
            { name: 'State', type: 'TINYINT', nullable: false, default: 1 },
        ]

        return columns
    },
    createTable() {
        const columns = this.getColumns()
        const sql = getCreateTableSQL('users', columns)

        return sql
    },
}

module.exports = userModel
