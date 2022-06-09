const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const { create, list } = require('../controller/label.controller')

const lableRouter = new Router({prefix: '/label'})

lableRouter.post('/', verifyAuth, create)
lableRouter.get('/', list)

module.exports = lableRouter
