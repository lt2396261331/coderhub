const errorTypes = require('../constants/error-types')

const errorHandle = (error, ctx) => {
  let status, message
  let errorCode = 0
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400 // Bad Request
      message = '用户名或者密码为空~'
      errorCode = 10001
      break
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409 // Conflict
      message = '用户名已经存在~'
      errorCode = 10002
      break
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400 // 参数错误
      message = '用户名不存在~'
      errorCode = 10003
      break
    case errorTypes.PASSWORD_IS_INCORRECT:
      status = 400 // 参数错误
      message = '密码是错误的~'
      errorCode = 10003
      break
    case errorTypes.UNAUTHORIZATION:
      status = 401 // 参数错误
      message = '无效的token~'
      errorCode = 10004
      break
    case errorTypes.UNPERMISSION:
      status = 401 // 参数错误
      message = '您不具备操作的权限~'
      errorCode = 10005
      break
    default:
      status = 404
      message = 'NOT FOUND'
  }

  ctx.status = status;
  ctx.body = {
    errorCode,
    message
  }
}


module.exports = errorHandle