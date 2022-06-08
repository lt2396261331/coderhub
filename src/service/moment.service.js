const connection = require('../app/database')

const sqlFragment = `
  SELECT 
    m.id, m.content, m.createAt createTime, m.updateAt updateTime, 
    JSON_OBJECT('id', u.id, 'name', u.name) author
  FROM moment m 
  LEFT JOIN user u ON m.user_id = u.id
`

class MomentService {
  async create(userId, content) {
    const statment = 'INSERT INTO `moment`(content, user_id) VALUES (?, ?);'
    const [result] = await connection.execute(statment, [content, userId])
    return result
  }
  async getMomentById(id) {
    const statment = `
      ${sqlFragment} 
      WHERE m.id = 1
    `
    const [result] = await connection.execute(statment, [id])
    return result[0]
  }

  async getMomentList(offset, size) {
    const statment = `
      ${sqlFragment}
      LIMIT ?, ?
    `
    const [result] = await connection.execute(statment, [offset, size])
    return result
  }

  async update(content, momentId) {
    const statment = `UPDATE moment SET content = ? WHERE id = ?`
    const [result] = await connection.execute(statment, [content, momentId])
    return result
  }

  async remove(momentId) {
    const statment = `DELETE FROM moment WHERE id = ?`
    const [result] = await connection.execute(statment, [momentId])
    return result
  }
}

module.exports = new MomentService()
