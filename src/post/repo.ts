import { getClient } from '../database'
import { Comment } from '../models/Comment'
import { Post } from '../models/Post'

export async function getPostById(id: string): Promise<Post | undefined> {
    try {
        const pool = getClient()
        const query = 'SELECT * FROM "posts" WHERE id = $1'
        const values = [id]
        const result = await pool.query(query, values)
        console.log(result)

        if (result.rows.length === 0) {
            return undefined
        }

        return result.rows[0] as Post
    } catch (error) {
        console.log(error)
        throw new Error(`Error fetching pst by id: ${error}`)
    }
}

export async function createPostComment(comment: Comment): Promise<Comment> {
    try {
        const pool = getClient()
        const query =
            'INSERT INTO "comments" (id, post_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *'
        const values = [
            comment.id,
            comment.post_id,
            comment.user_id,
            comment.content,
        ]
        const result = await pool.query(query, values)
        return result.rows[0] as Comment
    } catch (error) {
        console.error(error)
        throw new Error(`Error creating user: ${error}`)
    }
}
