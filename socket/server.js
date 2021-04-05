require('dotenv').config({ path: '.env.development' })

const WebSocket = require('ws')
const { pages } = require('../lib/deta')

const server = new WebSocket.Server({ port: process.env.PORT || 4000 })
const sockets = {}

server.on('connection', (socket) => {
    let first = true
    let editable = false
    let savedKey = null

    socket.on('message', async (message) => {
        if (first) {
            first = false

            const { key, tokens } = JSON.parse(message)
            const page = await pages.get(key)
            if (!page) return socket.close()

            editable = tokens.includes(page.token)
            savedKey = key

            if (!sockets[key]) sockets[key] = []
            sockets[key].push(socket)
            
            socket.send(editable.toString())
        } else if (editable) {
            await pages.update({ content: message }, savedKey)

            for (let i = 0; i < sockets[savedKey].length; i++) {
                const updateSocket = sockets[savedKey][i]
                if (socket === updateSocket) continue

                try {
                    updateSocket.send(message)
                } catch {
                    sockets[savedKey].splice(i, 1)
                }
            }
        }
    })
})
