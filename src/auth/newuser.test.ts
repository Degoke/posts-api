import { randomUUID } from 'crypto'
import express from 'express'
import request from 'supertest'
import { initApp, shutdownApp } from '../app'
import { loadTestConfig } from '../config'
import { createTestUser } from '../tets.setup'

jest.mock('hibp')

const app = express()
const oldEmail = randomUUID() + '@example.com'
const email = randomUUID() + '@example.com'
const password = randomUUID()
const name = randomUUID()

describe('NewUser', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)

        const user = await createTestUser(oldEmail, password)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('Missing email', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email: '',
                password,
                name,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Valid email address is required'
        )
    })

    test('Invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email: 'xyz',
                password,
                name,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Valid email address is required'
        )
    })

    test('Missing password', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email,
                password: '',
                name,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Password must be at least 8 characters'
        )
    })

    test('missing name', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email,
                password,
                name: '',
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe('Valid Name is required')
    })

    test('Email already exists', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email: oldEmail,
                password,
                name,
            })
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Email already registered')
    })

    test('Success', async () => {
        const res = await request(app)
            .post('/api/auth/newuser')
            .type('json')
            .send({
                email,
                password,
                name,
            })
        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.user).toBeDefined()
        expect(res.body.user.password).toBeUndefined()
    })
})
