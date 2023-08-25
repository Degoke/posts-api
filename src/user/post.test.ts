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
const email2 = randomUUID() + '@example.com'
const password = randomUUID()
const content = randomUUID() + 'content'
const title = randomUUID() + 'title'

let user: User
let post: Post
let user2: User

describe('Create Posts', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)

        user = await createTestUser(email, password)
        user2 = await createTestUser(email2, password)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('Missing title', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        const res = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title: '',
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe('Valid Title is required')
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

        const res = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content: '',
                title,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe('Valid Content is required')
    })

    test('Invalid userId', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        const res = await request(app)
            .post(`/api/users/userid/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title,
            })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid User Id')
    })

    test('No Authentication', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        const res = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ')
            .type('json')
            .send({
                content,
                title,
            })
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('AuthenticationError: Unauthorized')
    })

    test('User Id different from current user', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        const res = await request(app)
            .post(`/api/users/${user2.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title,
            })
        expect(res.status).toBe(403)
        expect(res.body.message).toBe('Forbidden')
    })

    test('Post already exists', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(loginRes.status).toBe(200)
        expect(loginRes.body.token).toBeDefined()

        const res = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title,
            })
        expect(res.status).toBe(201)
        expect(res.body.post).toBeDefined()

        const res2 = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title,
            })

        expect(res2.status).toBe(400)
        expect(res2.body.message).toBe('Title already Exists')
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

        const res = await request(app)
            .post(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({
                content,
                title: 'new Title',
            })
        expect(res.status).toBe(201)
        expect(res.body.post).toBeDefined()
    })
})

describe('Get Posts', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)
        post = await createTestPost(user.id)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('Invalid userId', async () => {
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
            .get(`/api/users/userid/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({})
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Invalid User Id')
    })

    test('No Authentication', async () => {
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
            .get(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ')
            .type('json')
            .send({})
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
            .get(`/api/users/${user.id}/posts`)
            .set('Authorization', 'Bearer ' + loginRes.body.token)
            .type('json')
            .send({})
        expect(res.status).toBe(200)
        expect(res.body.posts).toBeDefined()
    })
})
