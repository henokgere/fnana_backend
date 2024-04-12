const DataAccess = require('../../services/data-manip/data-access')

class UserService extends DataAccess {
    constructor() {
        super('users')
    }
}

module.exports = UserService
