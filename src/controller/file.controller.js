const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')

class FileController {
  async saveAvatarInfo(ctx, next) {
    try {
      // 1.获取图像相关的信息
      const { filename, mimetype, size } = ctx.req.file
      const { id } = ctx.user

      // 2.讲图像信息数据保存到数据库中
      const result = await fileService.createAvatar(
        filename,
        mimetype,
        size,
        id
      )

      // 3.讲图片地址保存到user表中
      const avatarUrl = `${APP_HOST}:${APP_PORT}/users/avatar/${id}`
      await userService.updateAvatarUrlById(avatarUrl, id)
      // 返回结果
      ctx.body = {
        statusCode: 0,
        message: '上传成功'
      }
    } catch (error) {
      ctx.body = {
        status: 1000,
        message: '上传失败'
      }
    }
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像信息
    const  files  = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query
    // 2.将所有的文件信息保存到数据库
    try {
      for (let file of files) {
        const { filename, mimetype, size } = file
        await fileService.createFile(filename, mimetype, size, id, momentId)
      }

      ctx.body = {
        statusCode: 0,
        message: '上传完成'
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        statusCode: 10000,
        message: '上传失败'
      }
    }
  }
}

module.exports = new FileController()