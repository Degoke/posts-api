import { randomUUID } from 'crypto'
import express from 'express'
import request from 'supertest'
import { initApp, shutdownApp } from '../app'
import { loadTestConfig } from '../config'
import {
    createTestComment,
    createTestPost,
    createTestUser,
} from '../tets.setup'
import { User } from '../models/User'
import { Post } from '../models/Post'
import { Comment } from '../models/Comment'
import { getClient } from '../database'

jest.mock('hibp')

const app = express()
const email = randomUUID() + '@example.com'
const email2 = randomUUID() + '@example.com'
const password = randomUUID()

let user: User
let user2: User

const posts: Map<string, Post[]> = new Map()
const comments: Map<string, Comment[]> = new Map()

describe('Get Top 3 Users with most posts and latest comment', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)

        for (let i = 0; i <= 10; i++) {
            const user = await createTestUser(
                randomUUID() + '@example.com',
                randomUUID()
            )

            const numPosts = Math.floor(Math.random() * 100)
            for (let j = 0; j < numPosts; j++) {
                const post = await createTestPost(
                    user.id,
                    randomUUID() + 'title'
                )
                const previous = posts.get(user.id)
                if (!previous) {
                    posts.set(user.id, [post])
                } else {
                    posts.set(user.id, [...previous, post])
                }

                const numComments = Math.floor(Math.random() * 2)
                for (let k = 0; k < numComments; k++) {
                    const comment = await createTestComment(post.id, user.id)
                    const prevComment = comments.get(post.id)
                    if (!prevComment) {
                        comments.set(post.id, [comment])
                    } else {
                        comments.set(post.id, [...prevComment, comment])
                    }
                }
            }
        }
    })

    afterAll(async () => {
        for (const [key, _] of comments.entries()) {
            const pool = getClient()
            await pool.query(`DELETE FROM comments WHERE post_id = $1`, [key])
            await pool.query(`DELETE FROM posts WHERE id = $1`, [key])
        }
        await shutdownApp()
    })

    test('success', async () => {
        let longestKey = ''
        let maxLength = 0

        for (const [key, array] of posts.entries()) {
            if (array.length > maxLength) {
                maxLength = array.length
                longestKey = key
            }
        }

        const res = await request(app).get(`/api/users/topusers`).send({})
        expect(res.status).toBe(200)
        expect(res.body.users).toBeDefined()
        expect(res.body.users.length).toBe(3)
        expect(res.body.users[0].user_id).toBe(longestKey)
        expect(res.body.users[0].post_count).toBe(maxLength.toString())
    })
})

describe('Get All Users', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)
        user = await createTestUser(email, password)
        user2 = await createTestUser(email2, password)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('success', async () => {
        const res = await request(app).get(`/api/users/`).send({})
        expect(res.status).toBe(200)
        expect(res.body.users).toBeDefined()
        expect(res.body.users.length).toBeGreaterThan(1)
        expect(res.body.users[0].password).toBeUndefined()
    })
})
