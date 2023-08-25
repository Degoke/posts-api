import { getClient } from '../database'
import { User } from '../models/User'
import { Post } from '../models/Post'

export async function getAllUsers(): Promise<User[]> {
    try {
        const pool = getClient()
        const query =
            'SELECT id, name, email, last_updated, created_at FROM "users"'
        const result = await pool.query(query)

        if (result.rows.length === 0) {
            return []
        }

        return result.rows as User[]
    } catch (error) {
        throw new Error(`Error fetching users: ${error}`)
    }
}

export async function getTopUsersWithMostPosts(count: number): Promise<any> {
    try {
        const pool = getClient()
        const query = `SELECT 
        users.id AS user_id,
        users.email AS user_email,
        top_users.post_count AS post_count,
        latest_post.title AS latest_post_title,
        latest_comment.content AS latest_comment_content
    FROM users
    JOIN (
        SELECT 
            user_id,
            COUNT(id) AS post_count
        FROM posts
        GROUP BY user_id
        ORDER BY post_count DESC
        LIMIT $1
    ) AS top_users ON users.id = top_users.user_id
    LEFT JOIN LATERAL (
        SELECT 
            id AS post_id,
            title
        FROM posts
        WHERE user_id = top_users.user_id
        ORDER BY created_at DESC
        LIMIT 1
    ) AS latest_post ON true
    LEFT JOIN LATERAL (
        SELECT 
            post_id,
            content
        FROM comments
        WHERE user_id = top_users.user_id
        ORDER BY created_at DESC
        LIMIT 1
    ) AS latest_comment ON true
    ORDER BY top_users.post_count DESC;
    ;
    
        
          `
        const values = [count]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return []
        }

        return result.rows as User[]
    } catch (error) {
        throw new Error(`Error fetching users: ${error}`)
    }
}

export async function getUserById(id: string): Promise<User | undefined> {
    try {
        const pool = getClient()
        const query = 'SELECT * FROM "users" WHERE id = $1'
        const values = [id]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return undefined
        }

        return result.rows[0] as User
    } catch (error) {
        console.log(error)
        throw new Error(`Error fetching user by id: ${error}`)
    }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    try {
        const pool = getClient()
        const query = 'SELECT * FROM "users" WHERE email = $1'
        const values = [email]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return undefined
        }

        return result.rows[0] as User
    } catch (error) {
        console.log(error)
        throw new Error(`Error fetching user by email: ${error}`)
    }
}

export async function createUser(user: User): Promise<User> {
    try {
        const pool = getClient()
        const query =
            'INSERT INTO "users" (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *'
        const values = [user.id, user.name, user.email, user.password]
        const result = await pool.query(query, values)
        return result.rows[0] as User
    } catch (error) {
        console.error(error)
        throw new Error(`Error creating user: ${error}`)
    }
}

export async function createUserPost(post: Post): Promise<Post> {
    try {
        const pool = getClient()
        const query =
            'INSERT INTO posts (id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *'
        const values = [post.id, post.user_id, post.title, post.content]
        const result = await pool.query(query, values)
        return result.rows[0] as Post
    } catch (error) {
        console.error(error)
        throw new Error(`Error creating user: ${error}`)
    }
}

export async function getPostByTitle(
    userId: string,
    title: string
): Promise<User | undefined> {
    try {
        const pool = getClient()
        const query = 'SELECT * FROM "posts" WHERE user_id = $1 AND title = $2'
        const values = [userId, title]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return undefined
        }

        return result.rows[0] as User
    } catch (error) {
        console.log(error)
        throw new Error(`Error fetching user posts by title: ${error}`)
    }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
    try {
        const pool = getClient()
        const query = 'SELECT * FROM "posts" WHERE user_id = $1'
        const values = [userId]
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return []
        }

        return result.rows as Post[]
    } catch (error) {
        throw new Error(`Error fetching users: ${error}`)
    }
}
