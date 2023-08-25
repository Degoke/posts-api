import { randomUUID } from 'crypto'
import express from 'express'
import request from 'supertest'
import { initApp, shutdownApp } from '../app'
import { loadTestConfig } from '../config'
import { createTestPost, createTestUser } from '../tets.setup'
import { User } from '../models/User'
import { Post } from '../models/Post'

jest.mock('hibp')

const app = express()
const email = randomUUID() + '@example.com'
const password = randomUUID()
const content = randomUUID()

let user: User
let post: Post

describe('New Comment', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)

        user = await createTestUser(email, password)
        post = await createTestPost(user.id)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('Missing content', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        expect(post).toBeDefined()
        const res = await request(app)
            .post(`/api/posts/${post.id}/comments`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content: '',
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe('Valid Content is required')
    })

    test('Invalid postId', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        expect(post).toBeDefined()
        const res = await request(app)
            .post(`/api/posts/postId/comments`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
            })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid Post Id')
    })

    test('No Authenticcation', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        expect(post).toBeDefined()
        const res = await request(app)
            .post(`/api/posts/${post.id}/comments`)
            .set('Authorization', 'Bearer ')
            .type('json')
            .send({
                content,
            })
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('AuthenticationError: Unauthorized')
    })

    test('Success', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        expect(post).toBeDefined()
        const res = await request(app)
            .post(`/api/posts/${post.id}/comments`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
            })
        expect(res.status).toBe(201)
        expect(res.body.comment).toBeDefined()
    })
})
