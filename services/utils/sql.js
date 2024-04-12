function getCreateTableSQL(table, columns, foreignKeys = []) {
    /**
     * columns: Array of: {name,type,autoIncrement,primaryKey,unique,nullable,default,onUpdate}
     */
    const fksSql = foreignKeys.map(
        (fk) =>
            `FOREIGN KEY (${fk.column}) REFERENCES ${fk.table}(${fk.foreignKey})`
    )

    // ${col.name === 'UserId' ? ' COLLATE latin1_swedish_ci' : ''}

    const createTableSql = `CREATE TABLE ${table} (${columns
        .map(
            (col) =>
                `${col.name} ${col.type}${
                    col.primaryKey ? ' PRIMARY KEY' : ''
                }${col.autoIncrement ? ' AUTO_INCREMENT' : ''}
                
                ${col.nullable === false ? ' NOT NULL' : ''}${
                    col.unique === true ? ' UNIQUE' : ''
                }${'default' in col ? ' DEFAULT ' + col.default : ''}${
                    'onUpdate' in col ? ' ON UPDATE ' + col.onUpdate : ''
                }`
        )
        .join(', ')} ${foreignKeys.length > 0 ? ', ' + fksSql.join(', ') : ''})`

    return createTableSql
}

module.exports = { getCreateTableSQL }
