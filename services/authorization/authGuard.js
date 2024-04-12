const jwt = require('jsonwebtoken')

function authGuard(req, res, next) {
    const token = req.headers['token']
    const SECRET = 'secret'
    if (!token) return res.sendStatus(401)

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.sendStatus(401)

        req.userId = decoded.id
        next()
    })
}

module.exports = { authGuard }
