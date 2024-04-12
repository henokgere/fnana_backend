const { createServer } = require('http')
const app = require('./app')

const httpServer = createServer(app)

httpServer.listen(3500, () => {
    console.log('running on 3500...')
})

