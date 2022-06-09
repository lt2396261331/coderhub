const service = require('../service/label.service')

class LableController{
  async create(ctx, next) {
    const { name } = ctx.request.body
    const result = await service.create(name)
    ctx.body = result
  }

  async list(ctx, next) {
    try {
      const { limit, offset } = ctx.query
      const result = await service.getLabels(limit, offset)

      ctx.body = {
        status: 0,
        data: {
          list: result
        }
      }
    } catch (error) {
      ctx.body = {
        status: 400,
        message: '参数错误'
      }
    }
  }
}


module.exports = new LableController()