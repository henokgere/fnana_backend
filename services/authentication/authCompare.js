const bcrypt = require('bcrypt')

authCompare = async (password, realPassword) => {
    let validPass = await bcrypt.compare(password, realPassword)
    if (validPass) {
        return true
    } else {
        return false
    }
}

module.exports = authCompare
