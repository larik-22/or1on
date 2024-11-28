import { describe, it, expect } from 'vitest';
import { app } from '../index.js';
import { generateToken } from '../utils/jwt.js';
import { createUser } from '../controllers/userController.js';

const mockEnv = {
    ALLOWED_HOST: '*',
    ENV: 'test',
};

describe('POST /auth', () => {
    it('should successfully register a user', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        };

        const response = await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(userData),
        }, mockEnv);

        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('User registered successfully');
        expect(responseBody.user.email).toBe(userData.email);
    });

    it('should return 400 for invalid registration data', async () => {
        const invalidData = { email: 'user@example', password: '123' };

        const response = await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(invalidData),
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(400);
        expect(responseBody.error.message).toBe('Invalid registration data');
    });

    it('should return 409 if user already exists', async () => {
        const existingUser = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        };

        await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(existingUser),
        }, mockEnv);

        const response = await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(existingUser),
        }, mockEnv);

        expect(response.status).toBe(409);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(409);
        expect(responseBody.error.message).toBe('User already exists');
    });

    it('should successfully login with valid credentials', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        };

        await createUser(user);

        const loginData = {
            email: 'user@example.com',
            password: 'password123',
        };

        const response = await app.request('/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(loginData),
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Login successful');
        expect(responseBody.token).toBeDefined();
    });

    it('should return 401 for invalid login data', async () => {
        const invalidLogin = {
            email: 'user@example.com',
            password: 'wrong password',
        };

        const response = await app.request('/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(invalidLogin),
        }, mockEnv);

        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(401);
        expect(responseBody.error.message).toBe('Invalid password');
    });
});

describe('GET /test/protected', () => {
    it('should be accessible to logged-in users with valid token', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        };

        const createdUser = await createUser(user);
        const token = await generateToken({
            ...createdUser,
            password: user.password
        });

        const response = await app.request('/test/protected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Hello, user@example.com! This is a protected route.');
    });

    it('should return 401 for unauthenticated users', async () => {
        const response = await app.request('/test/protected', {
            method: 'GET',
        }, mockEnv);

        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(401);
        expect(responseBody.error.message).toBe('Unauthorized');
    });
});

describe('GET /test/adminprotected', () => {
    it('should be accessible to admin users', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        };

        const createdAdmin = await createUser(adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        const response = await app.request('/test/adminprotected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('This is an admin-protected route');
    });

    it('should return 403 for non-admin users', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        };

        const createdUser = await createUser(user);
        const token = await generateToken({
            ...createdUser,
            password: user.password
        });

        const response = await app.request('/test/adminprotected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        expect(response.status).toBe(403);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(403);
        expect(responseBody.error.message).toBe('Forbidden: Admins only');
    });
});
