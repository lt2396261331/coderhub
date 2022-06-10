const fs = require('fs')
const { PICTURE_PATH } = require('../constants/file-path')
const fileService = require('../service/file.service')
const momentService = require('../service/moment.service')
class MomentController {
  async create(ctx, next) {
    // 1.获取数据(user_id, content)
    const userId = ctx.user.id
    const content = ctx.request.body.content

    // 2.将数据插入数据库
    const result = await momentService.create(userId, content)
    ctx.body = result
  }
  async detail(ctx, next) {
    // 1.拿到momentId
    const momentId = ctx.params.momentId

    // 2.根据id去查询这条数据
    const result = await momentService.getMomentById(momentId)

    ctx.body = result
  }
  async list(ctx, next) {
    const { offset, size } = ctx.query
    // 查询列表
    const result = await momentService.getMomentList(offset, size)

    ctx.body = result
  }
  async update(ctx, next) {
    console.log('update')
    const { momentId } = ctx.params
    const { content } = ctx.request.body
    const { id } = ctx.user

    // 修改内容
    const result = await momentService.update(content, momentId)
    ctx.body = result
  }
  async remove(ctx, next) {
    // 1.获取momentId
    const { momentId } = ctx.params
    // 2.删除内容
    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  async addLabels(ctx, next) {
    // 1.获取标签和动态id
    const labels = ctx.labels
    const { momentId } = ctx.params
    
    // 2.添加所有的标签
    for(let label of labels) {
      // 2.1判断标签是否已经存在
      const isExist = await momentService.hasLabel(momentId, label.id)
      if (!isExist) {
        await momentService.addLabel(momentId, label.id)
      }
    }

    ctx.body = {
      status: 0,
      message: '给动态添加标签成功~'
    }
  }

  async fileInfo(ctx, next) {
    try {
      let { filename } = ctx.params
      const fileInfo = await fileService.getFileByFilename(filename)
      
      const { type } = ctx.query
      const types = ['small', 'middle', 'large']
      if (types.includes(type)) {
        filename = filename + '-' + type
      }
      
      ctx.response.set('content-type', fileInfo.mimetype)
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new MomentController()