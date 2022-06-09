const Router = require('koa-router')
const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  create,
  list,
  detail,
  update,
  remove,
  addLabels
} = require('../controller/moment.controller')

const {
  verifyLabelExists
} = require('../middleware/label.middleware')

const momentRouter = new Router({prefix: '/moment'})

momentRouter.post('/', verifyAuth, create)
momentRouter.get('/', list)
momentRouter.get('/:momentId', detail)

// 1.用户必须登录
// 2.用户是否有权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)

// 给动态添加标签的接口
momentRouter.post('/lables/:momentId', verifyAuth, verifyPermission, verifyLabelExists, addLabels)

module.exports = momentRouter