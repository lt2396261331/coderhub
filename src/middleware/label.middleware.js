const service = require('../service/label.service')
const verifyLabelExists = async (ctx, next) => {
  try {
    // 1.取出所有标签
    const { labels } = ctx.request.body
    const newLabels = []
    for (let name of labels) {
      const labelResult = await service.getLabelByName(name)
      const label = { name }
      if (!labelResult) {
        const result = await service.create(name)
        label.id = result.insertId
      } else {
        label.id = labelResult.id
      }

      newLabels.push(label)
    }

    ctx.labels = newLabels

    await next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  verifyLabelExists
}