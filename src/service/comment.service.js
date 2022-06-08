const connection = require('../app/database')

class CommentService {
  async create(momentId, content, userId) {
    try {
      const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES (?, ?, ?)`
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        userId
      ])
      return result
    } catch (error) {
      console.log(error)
    }
  }
  async reply(momentId, content, userId, commentId) {
    try {
      const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?)`
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        userId,
        commentId
      ])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async update(commentId, content) {
    try {
      const statement = `UPDATE comment SET content = ? WHERE id = ?`
      const [result] = await connection.execute(statement, [content, commentId])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async remove(commentId) {
    try {
      const statement = `DELETE FROM comment WHERE id = ?`
      const [result] = await connection.execute(statement, [commentId])
      return result
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new CommentService()
