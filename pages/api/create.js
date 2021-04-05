import { nanoid } from 'nanoid/async'
import { pages } from '../../lib/deta'
import Cookie from 'cookie'

export default async (req, res) => {
    const token = await nanoid(128)

    {
        const tokens = req.cookies.notesTokens
            ? req.cookies.notesTokens.split(',')
            : []
        tokens.push(token)
        const cookie = Cookie.serialize('notesTokens', tokens.join(','), { path: '/' })
        res.setHeader('Set-Cookie', cookie)
    }

    const key = await nanoid(8)
    await pages.put({
        key,
        token,
        content: ''
    })
    res.redirect(`/${key}`)
}