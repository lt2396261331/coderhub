const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const errorHandle = require('./error-handle')
const useRouter = require('../router')

const app = new Koa()

app.use(bodyParser())
useRouter(app)
app.on('error', errorHandle)

module.exports = app

