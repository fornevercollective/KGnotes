import { useEffect, useState, useRef } from 'react'
import { pages } from '../lib/deta'
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
        const socket = new WebSocket('wss://notes-production.up.railway.app/')

        socket.addEventListener('message', (event) => {
            if (first) {
                first = false
                setSocket(socket)
                console.info(event.data)
            } else {
                setValue(event.data)
            }
        })
        socket.addEventListener('open', () => socket.send(JSON.stringify({
            key: props.pageKey,
            tokens: props.notesTokens
        })))
        socket.addEventListener('close', () => setSocket(null))
        socket.addEventListener('error', (error) =>{ 
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
    
    const page = await pages.get(ctx.params.key)
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