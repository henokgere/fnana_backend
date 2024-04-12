const jwt = require('jsonwebtoken')

const SECRET = 'secret'

const signToken = (req, res, token) => {
    if (!token) {
        return res.status(202).send('need proper name for authorization')
    }
    return jwt.sign({ id: token }, SECRET)
}

module.exports = signToken
