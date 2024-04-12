const fs = require('fs-extra')

function fileRenamer(req, res, next) {
    if(!req.file) return res.status(406).send("file required")
    fs.rename(
        `${req.file.destination}${req.file.filename}`,
        `${req.file.destination}${req.file.originalname}`,
        function (err) {
            if (err) {
                return fs.unlink(
                    `${req.file.destination}${req.file.filename}`,
                    function (err) {
                        if (err) return res.status(500).send(err)
                        res.status(500).send('deleted')
                    }
                )
            }
            next()
        }
    )
}

module.exports = { fileRenamer }
