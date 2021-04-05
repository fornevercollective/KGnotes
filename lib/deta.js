const { Deta } = require('deta')
const deta = Deta(process.env.DETA_KEY)
module.exports.pages = deta.Base('pages')