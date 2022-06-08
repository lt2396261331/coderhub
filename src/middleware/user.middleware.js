const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_ALREADY_EXISTS
} = require('../constants/error-types')
const service = require('../service/user.service')
const md5password = require('../utils/password-hanle')

const verifyUser = async (ctx, next) => {
  // 获取用户名

  // 2.用户名和密码不能为空
  const { name, password } = ctx.request.body
  if (!name || !password) {
    // console.log(name, password)
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断这次注册的用户名是否被注册过
  const result = await service.getUserByName(name)
  if (result.length) {
    const error = new Error(USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next()
}

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body
  ctx.request.body.password = md5password(password)

  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}
