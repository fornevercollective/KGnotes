import { nanoid } from 'nanoid'
import { db } from '../../lib/s1db'
import Cookie from 'cookie'

export default async (req, res) => {
    const token = nanoid(128)

    {
        const tokens = req.cookies.notesTokens
            ? req.cookies.notesTokens.split(',')
            : []
        tokens.push(token)
        const cookie = Cookie.serialize('notesTokens', tokens.join(','), { path: '/' })
        res.setHeader('Set-Cookie', cookie)
    }

    const key = nanoid(8)
    await db.set(key, {
        token,
        content: ''
    })
    res.redirect(`/${key}`)
}