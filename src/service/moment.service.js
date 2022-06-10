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
      SELECT 
        m.id, m.content, m.createAt createTime, m.updateAt updateTime, 
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        IF(COUNT(l.id), JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ), NULL) labelList,
        (SELECT IF(COUNT(c.id),
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', c.id, 'content', c.content, 'comment_id', c.comment_id, 'createTime', c.createAt, 'updateTime', c.updateAt,
              'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatar_url', cu.avatar_url)
          )
        )
        ,NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id) commentList,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
        FROM file WHERE m.id = file.moment_id ) images
      FROM moment m 
        LEFT JOIN user u ON m.user_id = u.id
        LEFT JOIN moment_label ml ON m.id = ml.moment_id
        LEFT JOIN label l ON  ml.label_id = l.id 
      WHERE m.id = ?
      GROUP BY m.id
    `
    const [result] = await connection.execute(statment, [id])
    return result[0]
  }

  async getMomentList(offset, size) {
    const statment = `
      SELECT 
        m.id, m.content, m.createAt createTime, m.updateAt updateTime, 
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
	      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
        FROM file WHERE m.id = file.moment_id ) images
      FROM moment m 
      LEFT JOIN user u ON m.user_id = u.id
      LIMIT 0, 10
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

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`
    const [result] = await connection.execute(statement, [momentId, labelId])
    return result[0] ? true : false
  }

  async addLabel(momentId, labelId) {
    try {
      const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?)`
      const [result] = await connection.execute(statement, [momentId, labelId])
      return result
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new MomentService()
