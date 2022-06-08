const jwt = require('jsonwebtoken')
const { PUBLIC_KEY } = require('../app/config')
const {
  USER_DOES_NOT_EXISTS,
  PASSWORD_IS_INCORRECT,
  UNAUTHORIZATION,
  UNPERMISSION
} = require('../constants/error-types')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-hanle')

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body

  // 2. 判断用户名是否为空
  if (!name || !password) {
      // console.log(name, password)
      const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED)
      return ctx.app.emit('error', error, ctx)
    }

  // 3. 判断用户名是否存在
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user) {
    const error = new Error(USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 4. 判断密码是否一致
  if (md5password(password) !== user.password) {
    const error = new Error(PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', error, ctx)
  }

  
  ctx.user = user
  await next()
}

const verifyAuth = async (ctx, next) => {
  console.log('验证授权的middleware')
  // 1.获取token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    const error = new Error(UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')

  // 2.验证token 验证成功会返回id，name等之前payload 失败则会抛出异常
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  } catch (error) {
    const err = new Error(UNAUTHORIZATION)
    ctx.app.emit('error', err, ctx)
  }

}

/**
 * 权限的验证
 * 
 */

const verifyPermission = async (ctx, next) => {
  console.log('验证权限的middleware')
  // 1.获取参数
  // 根据用户id和momentid判断是否有权限
  const [ resourceKey ] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user
  
  // 查询是否有权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error(UNPERMISSION)
    await next()
  } catch (error) {
    return ctx.app.emit('error', error, ctx)
  }

}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}