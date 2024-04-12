const bcrypt = require('bcrypt')

let hashing = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

module.exports = hashing
