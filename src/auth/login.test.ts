import { randomUUID } from 'crypto'
import express from 'express'
import request from 'supertest'
import { initApp, shutdownApp } from '../app'
import { loadTestConfig } from '../config'
import { createTestUser } from '../tets.setup'

jest.mock('hibp')

const app = express()
const email = randomUUID() + '@example.com'
const password = randomUUID()

describe('Login', () => {
    beforeAll(async () => {
        const config = await loadTestConfig()
        await initApp(app, config)

        const user = await createTestUser(email, password)
    })

    afterAll(async () => {
        await shutdownApp()
    })

    test('Missing email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email: '',
                password,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Valid email address is required'
        )
    })

    test('Invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email: 'xyz',
                password,
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Valid email address is required'
        )
    })

    test('Missing password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password: '',
            })
        expect(res.status).toBe(422)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.errors[0].msg).toBe(
            'Invalid password, must be at least 5 characters'
        )
    })

    test('Wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password: 'wrong-password',
            })
        expect(res.status).toBe(401)
        expect(res.body.message).toBe('Email or password is invalid')
    })

    test('Success', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .type('json')
            .send({
                email,
                password,
            })
        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })
})
