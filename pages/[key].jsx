import { useEffect, useState } from 'react'
import { db } from '../lib/s1db'
import Error from 'next/error'

const KeyPage = (props) => {
    const [ socket, setSocket ] = useState(null)
    const [ value, setValue ] = useState(props.initialContent)

    useEffect(() => {
        if (socket) {
            socket.close()
            setSocket(null)
        }

        let first = true
        const newSocket = new WebSocket('wss://notes-production.up.railway.app/')

        newSocket.addEventListener('message', (event) => {
            if (first) {
                first = false
                setSocket(newSocket)
                console.info(event.data)
            } else {
                setValue(event.data)
            }
        })
        newSocket.addEventListener('open', () => newSocket.send(JSON.stringify({
            key: props.pageKey,
            tokens: props.notesTokens
        })))
        newSocket.addEventListener('close', () => setSocket(null))
        newSocket.addEventListener('error', (error) =>{ 
            console.error(error)
            setSocket(null)
        })
    }, [ props.pageKey ])

    if (props.error) return <Error statusCode={props.error} />
    
    return (
        <textarea
            autoFocus
            placeholder={props.editable
                ? 'Welcome to your notepad. Simple copy the URL to share.'
                : 'This page is currently empty.'}
            readOnly={!props.editable || !socket}
            value={value}
            onChange={(event) => {
                setValue(event.target.value)
                socket.send(event.target.value)
            }}
        />
    )
}

export const getServerSideProps = async (ctx) => {
    const notesTokens = ctx.req.cookies.notesTokens
        ? ctx.req.cookies.notesTokens.split(',')
        : []
    
    const page = await db.get(ctx.params.key)
    if (!page) return { props: { error: 404 } }

    return {
        props: {
            pageKey: ctx.params.key,
            initialContent: page.content,
            editable: notesTokens.includes(page.token),
            notesTokens
        }
    }
}

export default KeyPage