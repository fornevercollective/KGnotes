require('dotenv').config({ path: '.env.development' })

const WebSocket = require('ws')
const { db } = require('../lib/s1db')

const server = new WebSocket.Server({ port: process.env.PORT || 4000 })
const sockets = {}

server.on('connection', (socket) => {
    let first = true
    let editable = false
    let savedKey = null
    let savedToken = null

    socket.on('message', async (message) => {
        if (first) {
            first = false

            const { key, tokens } = JSON.parse(message)
            const page = await db.get(key)
            if (!page) return socket.close()

            editable = tokens.includes(page.token)
            savedKey = key
            savedToken = page.token

            if (!sockets[key]) sockets[key] = []
            sockets[key].push(socket)
            
            socket.send(editable.toString())
        } else if (editable) {
            await db.set(savedKey, { token: savedToken, content: message.toString('utf-8') })

            for (let i = 0; i < sockets[savedKey].length; i++) {
                const updateSocket = sockets[savedKey][i]
                if (socket === updateSocket) continue

                try {
                    updateSocket.send(message.toString('utf-8'))
                } catch {
                    sockets[savedKey].splice(i, 1)
                }
            }
        }
    })
})
