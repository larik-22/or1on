import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { generateToken } from '../utils/jwt.js';
import { getAllUsers, getUserById, deleteUser } from '../controllers/userController.js';
import { createUser, getUserByEmail } from '../controllers/userController.js';
import { deleteFeedback } from '../controllers/feedbackController.js'

import { getFeedbackByUserId, getFeedbackByHighlight } from '../controllers/feedbackController.js'
import { createTour, updateTour, deleteTour } from "../controllers/tourController.js";
import { getAllTours, getTourById, getHighlightsByTour } from "../controllers/tourController.js";
import {
    approveHighlightSuggestion,
    getHighlightsByUserToken,
    updateHighlight,
    createHighlightWithUser
} from "../controllers/highlightController.js";
import { createHighlight, deleteHighlight } from "../controllers/highlightController.js";
import { getAllHighlights, getHighlightById } from "../controllers/highlightController.js";
import {type EntityManager, MikroORM} from "@mikro-orm/core";
import { randomUUID } from "crypto";
import { createApp } from "../app.js";
import type { Hono } from 'hono';
import type { BlankEnv, BlankSchema } from 'hono/types';
import bcrypt from "bcryptjs";
import {getDBConnector, updateDBSchema} from "../utils/db.js";
import mikroConfig from '../../mikro-orm.config.js';
import logger from "../utils/logger.js";
import {createHighlightsGeoJSON} from "../controllers/highlightsController.js";
import {Highlight} from "../models/highlight.js";
import {User} from "../models/user.js";
import {Feedback} from "../models/feedback.js";
import {Tour} from "../models/tour.js";


const mockEnv = {
    ALLOWED_HOST: '*',
    ENV: 'test',
};

let em: EntityManager;
let app: Hono<BlankEnv, BlankSchema, "/">;

beforeEach(() => {
    em = {
        count: vi.fn(),
        findOne: vi.fn(async (_entity, condition) => {
            if (condition.email === 'user@example.com') {
                return {
                    id: randomUUID(),
                    email: 'user@example.com',
                    password: await bcrypt.hash('password123', 10),
                    isAdmin: false,
                    username: '880005553535',
                };
            } else if (condition.email === 'admin@example.com') {
                return {
                    id: randomUUID(),
                    email: 'admin@example.com',
                    password: await bcrypt.hash('password123', 10),
                    isAdmin: true,
                    username: '880005553535',
                };
            }
            return undefined;
        }),
        persistAndFlush: vi.fn(),
        create: vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() })),
        fork: vi.fn().mockReturnValue(em),
        populate: vi.fn()
    } as unknown as EntityManager;

    app = createApp(em);
});

afterEach(() => {
    vi.resetModules();
});

describe('POST /api/auth', () => {
    it('should successfully register a user', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        em.findOne = vi.fn(async () => null);

        const response = await app.request('/api/auth', {
            method: 'POST',
            body: JSON.stringify(userData),
        }, mockEnv);

        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('User registered successfully');
    });

    it('should successfully register an admin', async () => {
        const adminData = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        em.findOne = vi.fn(async () => null);

        const response = await app.request('/api/auth', {
            method: 'POST',
            body: JSON.stringify(adminData),
        }, mockEnv);

        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('User registered successfully');
    });

    it('should return 400 for invalid registration data', async () => {
        const invalidData = { email: 'user@example', password: '123' };

        const response = await app.request('/api/auth', {
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
            username: '880005553535',
        };

        const response = await app.request('/api/auth', {
            method: 'POST',
            body: JSON.stringify(existingUser),
        }, mockEnv);

        expect(response.status).toBe(409);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(409);
        expect(responseBody.error.message).toBe('User already exists');
    });

    it('should return 400 if missing required fields', async () => {
        const missingFieldsData = { email: 'user@example.com' };

        const response = await app.request('/api/auth', {
            method: 'POST',
            body: JSON.stringify(missingFieldsData),
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(400);
        expect(responseBody.error.message).toBe('Invalid registration data');
    });
});

describe('POST /api/auth/tokens', () => {
    it('should successfully login with valid credentials', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        await createUser(em, user);

        const loginData = {
            email: 'user@example.com',
            password: 'password123',
        };

        const response = await app.request('/api/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(loginData),
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Login successful');
        expect(responseBody.token).toBeDefined();
    });

    it('should successfully login as admin with valid credentials', async () => {
        const admin = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        await createUser(em, admin);

        const loginData = {
            email: 'admin@example.com',
            password: 'password123',
        };

        const response = await app.request('/api/auth/tokens', {
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

        const response = await app.request('/api/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(invalidLogin),
        }, mockEnv);

        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(401);
        expect(responseBody.error.message).toBe('Invalid password');
    });

    it('should return 400 if missing required fields', async () => {
        const missingFieldsData = { email: 'user@example.com' };

        const response = await app.request('/api/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(missingFieldsData),
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(400);
        expect(responseBody.error.message).toBe('Invalid login data');
    });
});

describe('createUser function', () => {
    it('should create a user and return correct fields', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, userData);

        expect(createdUser).toHaveProperty('id');
        expect(createdUser).toHaveProperty('email', userData.email);
        expect(createdUser).toHaveProperty('isAdmin', userData.isAdmin);
        expect(createdUser).not.toHaveProperty('password');
    });
});

describe('User Controller: getUserByEmail', () => {
    it('should fetch a user by email', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.email === createdUser.email) {
                return createdUser;
            }
            return null;
        }) as unknown as typeof em.findOne;
        const createdUser = await createUser(em, user);

        const fetchedUser = await getUserByEmail(em, createdUser.email);

        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.email).toBe(user.email);
    });

    it('should return undefined for non-existent user', async () => {
        const fetchedUser = await getUserByEmail(em, 'nonexistent@example.com');

        expect(fetchedUser).toBeUndefined();
    });
});

describe('GET /api/users', () => {
    it('should fetch all users and only be accessible to admins', async () => {
        const mockUsers = [
            {id: '1', email: 'user@example.com', is_admin: false},
            {id: '2', email: 'admin@example.com', is_admin: true}
        ]

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        em.find = vi.fn( async () => mockUsers);

        const response = await app.request('/api/users', {method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.users).toEqual(mockUsers);
    });
})

describe('GET /api/users/:id', () => {
    it('should fetch a user and only be accessible to admins', async () => {
        const mockUser = {id: '1', email: 'user@example.com', is_admin: false};

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        em.findOne = vi.fn( async (entity, condition) =>
            condition.id === mockUser.id ? mockUser: null);

        const response = await app.request('/api/users/1', {method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.user).toEqual(mockUser);
    });
    it('should return 404 if user is not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.findOne = vi.fn( async () => null);

        const response = await app.request('/api/users/2', {method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User not found');
    });
})

describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
        const mockUser = {id: '550e8400-e29b-41d4-a716-446655440020',
            email: 'user@example.com',
            is_admin: false};
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.findOne = vi.fn( async (entity, condition) =>{
            if(entity === User && condition.id === '550e8400-e29b-41d4-a716-446655440020'){
                return mockUser
            }
        });
        em.nativeDelete = vi.fn( async () => 1);

        const response = await app.request('/api/users/550e8400-e29b-41d4-a716-446655440020',
            {method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User deleted successfully');
    });
})

describe('GET /api/highlights/:id/feedbacks', () => {
    it('should fetch all feedbacks from a highlight', async () => {
        const expectedFeedbacks = [
            {
                "id": 1,
                "highlight": {
                    "id": 1,
                    "name": "something"
                },
                "user": {
                    "id": "1",
                    "username": "test@mail1.com"
                },
                "rating": 4,
                "comment": "someDescription"
            }
        ]

        const feedbacks = [
            {
                "id": 1,
                "highlight": {
                    "id": 1,
                    "name": "something"
                },
                "user": {
                    "id": "1",
                    "username": "test@mail1.com"
                },
                "rating": 4,
                "comment": "someDescription",
                "is_approved": true,
            }
        ]

        em.find = vi.fn(async () => feedbacks);

        const response = await app.request('/api/highlights/1/feedbacks', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(expectedFeedbacks);
    });
    it('should return 400 if highlight id is invalid', async () => {
        const response = await app.request('/api/highlights/invalidHighlightId/feedbacks',
            {method: 'GET'}, mockEnv);

        expect(response.status).toBe(400);
    });
})

describe('GET /api/users/:id/feedbacks', () => {
    it('should fetch all feedbacks from a user', async () => {
        const feedback = [{id: '1',
            user: {id: '550e8400-e29b-41d4-a716-446655440020',
                email: 'test@mail1.com',
                isAdmin: false},
            rating: 4}];
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        em.find = vi.fn(async () => feedback);

        const response = await app.request(
            '/api/users/550e8400-e29b-41d4-a716-446655440020/feedbacks',
            {method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(feedback);
    });
    it('should return 404 if no feedback is found for user', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.find = vi.fn( async () => []);

        const response = await app.request(
            '/api/users/550e8400-e29b-41d4-a716-446655440020/feedbacks',
            {method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('No feedback found');
    });
    it('should return 400 if user id is invalid', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        const response = await app.request('/api/users/7/feedbacks',
            {method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
})

describe('PUT /api/feedbacks/:id/approve', () => {
    it('should should approve a highlight suggestion', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.nativeUpdate = vi.fn(async () => 1);

        const response = await app.request('/api/feedbacks/1/approve', {method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback approved successfully');
    });
    it('should return 400 for invalid feedback id', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        const response = await app.request('/api/feedbacks/invalidId/approve',
            {method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
})

describe('DELETE /api/users/:id/feedbacks/:id', () => {
    it('should delete feedback', async () => {
        const mockUser = {id: '550e8400-e29b-41d4-a716-446655440020',
            email: 'user@example.com',
            is_admin: false};
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdUser,
            password: adminUser.password
        });
        em.findOne = vi.fn( async (entity, condition) =>{
            if(entity === User && condition.id === '550e8400-e29b-41d4-a716-446655440020'){
                return mockUser
            }
        });
        em.nativeDelete = vi.fn(async (entity, condition) => {
            if(entity === Feedback && condition.id === 1){
                return 1
            }
            return 0
        });

        const response = await app.request(
            '/api/users/550e8400-e29b-41d4-a716-446655440020/feedbacks/1',
            {method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback deleted successfully');
    });
    it('should return 400 if invalid feedback id', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdUser,
            password: adminUser.password
        });
        const response = await app.request(
            '/api/users/550e8400-e29b-41d4-a716-446655440020/feedbacks/invalidId',
            {method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 400 if invalid user id', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdUser,
            password: adminUser.password
        });
        const response = await app.request('/api/users/5/feedbacks/1',
            {method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 404 if user is not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.findOne = vi.fn( async () => null);

        const response = await app.request(
            '/api/users/550e8400-e29b-41d4-a716-446655440020/feedbacks/1',
            {method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(404);
    });
})

describe('GET /api/highlights', () => {
    it('should fetch all highlights', async () => {
        const mockHighlights = [
            {
                id: 1,
                name: "something",
                description: "some description",
                category: "history",
                latitude: 40.7128,
                longitude: -74.0060,
                is_approved: false
            },
            {
                id: 2,
                name: "something",
                description: "some description",
                category: "history",
                latitude: 40.7128,
                longitude: -74.0060,
                is_approved: false
            }
        ]

        em.find = vi.fn( async () => mockHighlights);

        const response = await app.request('/api/highlights', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.highlights).toEqual(mockHighlights);
    });
})

describe('GET /api/highlights/:id', () => {
    it('should fetch a user and only be accessible to admins', async () => {
        const mockHighlight = {
            id: 1,
            name: "something",
            description: "some description",
            category: "history",
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        em.findOne = vi.fn( async (entity, condition) =>
            condition.id === mockHighlight.id ? mockHighlight: null);

        const response = await app.request('/api/highlights/1', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.highlight).toEqual(mockHighlight);
    });
    it('should return 404 if user is not found', async () => {
        em.findOne = vi.fn( async () => null);

        const response = await app.request('/api/highlights/2', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Highlight not found');
    });
})

describe('POST /api/highlights', () => {
    it('should create a new highlight', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        const createdUser = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdUser,
            password: adminUser.password
        });

        const highlightData = {
            name: "something",
            description: "some description",
            category: "history",
            latitude: 40.7128,
            longitude: -74.0060,
        }

        em.create = vi.fn((entity, data) => ({
            ...data,
            id: 1,
            users: { add: vi.fn() }
        }));
        em.persistAndFlush = vi.fn();
        em.findOne = vi.fn(async (entity, condition) => {
            if (entity === User && condition.email === createdUser.email) {
                return createdUser;
            }
            if (entity === Highlight && condition.id === 1) {
                return {
                    ...highlightData,
                    id: 1,
                    users: []
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/highlights', {
            method: 'POST',
            body: JSON.stringify(highlightData),
            headers: { 'Authorization': `Bearer ${token}`}
        }, mockEnv);

        expect(response.status).toBe(201);
    });
    it('should create a new highlight suggestion', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, user);
        const token = await generateToken({
            ...createdUser,
            password: user.password
        });

        const highlightData = {
            name: "something",
            description: "some description",
            category: "history",
            latitude: 40.7128,
            longitude: -74.0060,
        }


        em.create = vi.fn((entity, data) => ({
            ...data,
            id: 1,
            users: { add: vi.fn() }
        }));
        em.persistAndFlush = vi.fn();
        em.findOne = vi.fn(async (entity, condition) => {
            if (entity === User && condition.email === createdUser.email) {
                return createdUser;
            }
            if (entity === Highlight && condition.id === 1) {
                return {
                    ...highlightData,
                    id: 1,
                    users: []
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights', {
            method: 'POST',
            body: JSON.stringify(highlightData),
            headers: { 'Authorization': `Bearer ${token}`}
        }, mockEnv);

        expect(response.status).toBe(201);
    });
    it('should return 400 if invalid parameters', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };
        const highlightData = {
            name: 1,
            description: "some description",
            category: "history",
            latitude: 40.7128,
            longitude: -74.0060,
        }
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, user);
        const token = await generateToken({
            ...createdUser,
            password: user.password
        });
        const response = await app.request('/api/highlights', {
            method: 'POST',
            body: JSON.stringify(highlightData),
            headers: { 'Authorization': `Bearer ${token}`}
        }, mockEnv);

        expect(response.status).toBe(400);
    });
})

describe('PUT /api/highlights/:id/approve', () => {
    it('should should approve a highlight suggestion', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.nativeUpdate = vi.fn(async () => 1);

        const response = await app.request('/api/highlights/1/approve', {method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual(`Highlight with ID 1 approved`);
    });
    it('should return 400 for invalid highlight id', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        const response = await app.request('/api/feedbacks/invalidId/approve',
            {method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
})

describe('PUT /api/highlights/:id', () => {
    it('should should approve a highlight suggestion', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id: 1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        }
        const newData = {
            name: 'newName',
            description: 'some other description',
            category: 'pub',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: true
        }

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id) {
                return highlight;
            }
            return null;
        })

        const response = await app.request('/api/highlights/1', {method: 'PUT',
            body: JSON.stringify(newData),
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual(`Highlight with ID 1 updated`);
    });
    it('should return 400 for invalid highlight id', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        em.nativeUpdate = vi.fn(async () => 1);
        const highlight = {
            id: 1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        }
        const newData = {
            name: 1,
            description: "some other description",
            category: "pub",
            is_approved: true
        }

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id) {
                return highlight;
            }
            return null;
        })
        const response = await app.request('/api/highlights/1',
            {method: 'PUT',
                body: JSON.stringify(newData),
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 404 if highlight not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        const newData = {
            name: 'newName'
        }
        const response = await app.request('/api/highlights/1',
            {method: 'PUT',
                body: JSON.stringify(newData),
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(404);
    });
})

describe('DELETE /api/highlights/:id', () => {
    it('should delete highlight', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.nativeDelete = vi.fn(async () => 1);

        const response = await app.request('/api/highlights/1', {method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Highlight with ID 1 deleted');
    });
})

describe('getAllUsers function', () => {
    it('should fetch a list of users', async () => {
        const users = [
            {id: '1', email: 'test@mail1.com', isAdmin: false},
            {id: '2', email: 'test@mail2.com', isAdmin: false}
        ];

        em.find = vi.fn(async () => users);

        const fetchedUsers = await getAllUsers(em);

        expect(fetchedUsers).toBeDefined();
        expect(fetchedUsers).toHaveLength(2);
        expect(fetchedUsers[0].id).toBe(users[0].id);
        expect(fetchedUsers[1].id).toBe(users[1].id);
    });
    it('should return null if no users', async () => {
        em.findOne = vi.fn(async () => []);

        const fetchedUsers = await getAllUsers(em);

        expect(fetchedUsers).toBeNull();
    });
})

describe('getUserById function', () => {
    it('should fetch a user by id', async () => {
        const user = {
            id: '1',
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        }

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === user.id){
                return user;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const fetchedUser = await getUserById(em, user.id);

        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?.id).toBe(user.id);
    });

    it('should return null for non-existent user', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedUser = await getUserById(em, 'fakeID');

        expect(fetchedUser).toBeNull();
    });
});

describe('deleteUser function', () => {
    it('should delete a user', async () => {
        const user = {
            id: '1',
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
        }
        em.nativeDelete = vi.fn(async () => 1);

        await deleteUser(em, user.id);

        expect(em.nativeDelete).toBeCalledWith(User, {id: '1'});
    });
})

describe('getFeedbackByUserId function', () => {
    it('should get all feedback by a user', async () => {
        const feedbackOne = {
            id: 1,
            highlight: {id: 1,
                name: 'something',
                description: 'some description',
                category: 'history',
                is_approved: false},
            user: {id: 'randomUUIDMock',
                email: 'user@example.com',
                password: 'password123',
                isAdmin: false,},
            rating: 4,
            comment: 'crazy',
            is_approved: false,
        }
        const feedbacks = [ feedbackOne,
            {
                id: 2,
                highlight: {id: 2,
                    name: 'something',
                    description: 'some description',
                    category: 'history',
                    is_approved: false},
                user: {id: 'randomUUIDMock2',
                    email: 'user@example.com',
                    password: 'password123',
                    isAdmin: false,},
                rating: 4,
                comment: 'amazing',
                is_approved: false,
            }];

        em.find = vi.fn(async (_entity, condition) => {
            if (condition.user.id === 'randomUUIDMock'){
                return feedbacks.filter(f => f.user.id === 'randomUUIDMock');
            }
            return [];
        }) as unknown as typeof em.find;

        const fetchedFeedback = await getFeedbackByUserId(em, 'randomUUIDMock');

        expect(fetchedFeedback).toBeDefined();
        expect(fetchedFeedback).toHaveLength(1);
        expect(fetchedFeedback).toEqual([feedbackOne])
    });
    it('should return an empty list if no feedback exists with user ID', async () => {
        em.find = vi.fn(async () => []);

        const fetchedFeedback = await getFeedbackByUserId(em, 'randomId');

        expect(fetchedFeedback).toEqual([]);
    });
});

describe('getFeedbackByHighlight function', () => {
    it('should fetch feedback fo a highlight', async () => {
        const feedbackOne = {
            id: 1,
            highlight: {id: 1,
                name: 'something',
                description: 'some description',
                category: 'history',
                is_approved: false},
            user: {id: 1,
                email: 'user@example.com',
                password: 'password123',
                isAdmin: false,},
            rating: 4,
            comment: 'crazy',
            is_approved: false,
        }
        const feedbacks = [ feedbackOne,
            {
                id: 2,
                highlight: {id: 2,
                    name: 'something',
                    description: 'some description',
                    category: 'history',
                    is_approved: false},
                user: {id: 1,
                    email: 'user@example.com',
                    password: 'password123',
                    isAdmin: false,},
                rating: 4,
                comment: 'amazing',
                is_approved: false,
            }];

        em.find = vi.fn(async (_entity, condition) => {
            if (condition.highlight.id === 1){
                return feedbacks.filter(f => f.highlight.id === 1);
            }
            return [];
        }) as unknown as typeof em.find;

        const fetchedFeedback = await getFeedbackByHighlight(em, 1);

        expect(fetchedFeedback).toBeDefined();
        expect(fetchedFeedback).toHaveLength(1);
        expect(fetchedFeedback).toEqual([feedbackOne])
    });
    it('should return null if no feedback exists with highlight ID', async () => {
        em.find = vi.fn(async () => []);

        const fetchedFeedback = await getFeedbackByHighlight(em, 10);

        expect(fetchedFeedback).toBeNull();
    });
})

describe('deleteFeedback', () => {
    it('should delete feedback with given ID', async () => {
        const feedback = {
            id: '1',
            user: {id: '1',
                email: 'user@example.com',
                password: 'password123',
                isAdmin: false,},
            rating: 4,
            comment: 'crazy',
            is_approved: false,
        };
        em.nativeDelete = vi.fn(async () => 1);

        await deleteFeedback(em, feedback.id);

        expect(em.nativeDelete).toBeCalledWith(Feedback, {id: '1'});
    });
})

describe('getAllTours function', () => {
    it('should fetch all tours', async () => {
        const tours = [
            {id: '1', name: 'tourOne'},
            {id: '1', name: 'tourTwo'}
        ];

        em.find = vi.fn(async () => tours);

        const fetchedTours = await getAllTours(em);

        expect(fetchedTours).toBeDefined();
        expect(fetchedTours).toHaveLength(2);
        expect(fetchedTours[0].id).toBe(tours[0].id);
        expect(fetchedTours[1].id).toBe(tours[1].id);
    });
    it('should return null if no tours', async () => {
        em.find = vi.fn(async () => []);

        const fetchedTours = await getAllTours(em);

        expect(fetchedTours).toBeNull();
    });
})

describe('getTourById function', () => {
    it('should fetch a tour by id', async () => {
        const tour = {
            id: 1,
            name: 'someName'
        }

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === tour.id){
                return tour;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const fetchedTours = await getTourById(em, tour.id);

        expect(fetchedTours).toBeDefined();
        expect(fetchedTours?.id).toBe(tour.id);
    });

    it('should return null for non-existent tour', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedTours = await getTourById(em, 3);

        expect(fetchedTours).toBeNull();
    });
});

describe('getHighlightsByTour function', () => {
    it('should fetch a list of highlights by tour ID', async () => {
        const highlights= [{id: 1,
            name: 'something',
            description: 'some description',
            category: 'history',
            is_approved: false}]
        const tour = {
            id: 1,
            name: 'someName',
            highlights: {}
        };

        tour.highlights.getItems = vi.fn(() => highlights)

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === tour.id){
                return tour;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const fetchedHighlights = await getHighlightsByTour(em, tour.id);

        expect(fetchedHighlights).toBeDefined();
        expect(fetchedHighlights.highlights).toHaveLength(1)
        expect(fetchedHighlights.highlights).toEqual(tour.highlights.getItems());
    });
})

describe('createTour function', () => {
    it('should create a new tour', async () => {
        const tourData = {
            name: 'Historical Tour',
            description: 'A tour of historical sites.',
            duration_time: '2 hours',
            start_hour: '09:00:00'
        }

        em.create = vi.fn((entity, data) => ({...data, id: 1}));
        em.persistAndFlush = vi.fn;

        em.findOne = vi.fn(async (entity, condition) => {
            if (condition.id === 1){
                return {
                    id: 1,
                    ...tourData
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        await createTour(em, tourData)
        const createdTour = await getTourById(em, 1);

        expect(createdTour).toBeDefined();
    });
})

describe('updateTour function', () => {
    it('should should update existing tour', async () => {
        const tour = {
            id: '1',
            name: 'someName'
        };

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === tour.id){
                return tour
            }
            return null
        })

        await updateTour(em, tour.id, {name: 'newName'})
        const updatedTour = await getTourById(em, tour.id);

        expect(updatedTour).toBeDefined();
    });
})

describe('deleteTour function', () => {
    it('should delete tour with given ID', async () => {
        const tour = {
            id: '1',
            name: 'someName'
        };
        em.nativeDelete = vi.fn(async () => 1);

        await deleteTour(em, tour.id);

        expect(em.nativeDelete).toBeCalledWith(Tour, {id: '1'});
    });
})

describe('getAllHighlights function', () => {
    it('should fetch a list of highlights', async () => {
        const highlights = [
            {id: '1',
                name: 'something',
                description: 'someDescription',
                category: 'history',
                is_approved: false},
            {id: '2',
                name: 'somethingElse',
                description: 'someDescription',
                category: 'pubs',
                is_approved: false}
        ];

        em.find = vi.fn(async () => highlights);

        const fetchedHighlights = await getAllHighlights(em);

        expect(fetchedHighlights).toBeDefined();
        expect(fetchedHighlights).toHaveLength(2);
        expect(fetchedHighlights[0].id).toBe(highlights[0].id);
        expect(fetchedHighlights[1].id).toBe(highlights[1].id);
    });
    it('should return null if no users', async () => {
        em.findOne = vi.fn(async () => []);

        const fetchedHighlights = await getAllHighlights(em);

        expect(fetchedHighlights).toBeNull();
    });
})

describe('getHighlightById function', () => {
    it('should fetch a highlight by id', async () => {
        const highlight = {id: '2',
            name: 'somethingElse',
            description: 'someDescription',
            category: 'pubs',
            is_approved: false};

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id){
                return highlight;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const fetchedHighlight = await getHighlightById(em, highlight.id);

        expect(fetchedHighlight).toBeDefined();
        expect(fetchedHighlight?.id).toBe(highlight.id);
    });

    it('should return null for non-existent highlight', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedHighlight = await getHighlightById(em, 'fakeID');

        expect(fetchedHighlight).toBeNull();
    });
});

describe('createHighlight function', () => {
    it('should create highlight', async () => {
        const highlightData = {
            name: "something",
            description: "some description",
            category: "history",
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const user = {
            id: '1',
            email: 'admin@example.com',
            username: 'adminUser',
            highlights: [],
            verified: true
        };

        em.create = vi.fn((entity, data) => ({
            ...data,
            id: 1,
            users: { add: vi.fn() }
        }));
        em.persistAndFlush = vi.fn();
        em.findOne = vi.fn(async (entity, condition) => {
            if (entity === User && condition.email === user.email) {
                return user;
            }
            if (entity === Highlight && condition.id === 1) {
                return {
                    ...highlightData,
                    id: 1,
                    users: []
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        await createHighlight(em, highlightData, user.email);

        const createdHighlight = await getHighlightById(em, 1);

        expect(createdHighlight).toHaveProperty('id');
        expect(createdHighlight).toHaveProperty('name', highlightData.name);
        expect(createdHighlight).toHaveProperty('description', highlightData.description);
        expect(createdHighlight).toHaveProperty('category', highlightData.category);
        expect(createdHighlight).toHaveProperty('longitude', highlightData.longitude);
        expect(createdHighlight).toHaveProperty('latitude', highlightData.latitude);
        expect(createdHighlight).toHaveProperty('is_approved', highlightData.is_approved);
    });
})

describe('approveHighlightSuggestion function', () => {
    it('should approve a highlight suggestion', async () => {
        const highlight = {id: '2',
            name: 'somethingElse',
            description: 'someDescription',
            category: 'pubs',
            is_approved: false};

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id){
                return highlight;
            }
            return null;
        }) as unknown as typeof em.findOne;

        await approveHighlightSuggestion(em, highlight.id);

        const updatedHighlight = await getHighlightById(em, highlight.id);

        expect(updatedHighlight).toBeDefined();
    });
})

describe('updateHighlight function', () => {
    it('should should update existing highlight', async () => {
        const highlight = {id: '2',
            name: 'somethingElse',
            description: 'someDescription',
            category: 'pubs',
            is_approved: false};

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id){
                return highlight
            }
            return null
        })

        await updateHighlight(em, highlight.id, {name: 'newName'});

        const updatedHighlight = await getHighlightById(em, highlight.id);

        expect(updatedHighlight).toBeDefined();
    });
})

describe('deleteHighlight function', () => {
    it('should delete highlight with given ID', async () => {
        const highlight = {id: '2',
            name: 'somethingElse',
            description: 'someDescription',
            category: 'pubs',
            is_approved: false};
        em.nativeDelete = vi.fn(async () => 1);

        await deleteHighlight(em, highlight.id);

        expect(em.nativeDelete).toBeCalledWith(Highlight, {id: '2'});
    });
})

describe('Database Utilities', () => {
    it('getDBConnector should initialize MikroORM', async () => {
        const initMock = vi.spyOn(MikroORM, 'init').mockResolvedValue({} as MikroORM);

        const orm = await getDBConnector();

        expect(MikroORM.init).toHaveBeenCalledWith(mikroConfig);
        expect(orm).toBeDefined();

        initMock.mockRestore();
    });

    it('updateDBSchema should update the schema without errors', async () => {
        const schemaGeneratorMock = {
            updateSchema: vi.fn().mockResolvedValue(undefined),
        };
        const ormMock = {
            getSchemaGenerator: vi.fn().mockReturnValue(schemaGeneratorMock),
        } as unknown as MikroORM;

        const loggerInfoMock = vi.spyOn(logger, 'info').mockImplementation(vi.fn());


        await updateDBSchema(ormMock);

        expect(ormMock.getSchemaGenerator).toHaveBeenCalled();
        expect(schemaGeneratorMock.updateSchema).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Schema updated successfully');

        loggerInfoMock.mockRestore();
    });
});

describe('createHighlightsGeoJSON function', () => {
    it('should return GeoJSON object with approved highlights', async () => {
        const mockHighlights = [
            {
                id: 1,
                name: 'Highlight 1',
                description: 'Description 1',
                category: 'Category 1',
                latitude: 10.0,
                longitude: 20.0,
                is_approved: true,
            }
        ];

        em.find = vi.fn().mockResolvedValue(mockHighlights);

        const geoJSON = await createHighlightsGeoJSON(em);

        expect(geoJSON).toEqual({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [20.0, 10.0],
                    },
                    properties: {
                        id: 1,
                        name: 'Highlight 1',
                        description: 'Description 1',
                        category: 'Category 1',
                    },
                }
            ],
        });

        expect(em.find).toHaveBeenCalledWith(Highlight, { is_approved: true });
    });

    it('should return empty GeoJSON object if no approved highlights exist', async () => {
        em.find = vi.fn().mockResolvedValue([]);

        const geoJSON = await createHighlightsGeoJSON(em);

        expect(geoJSON).toEqual({
            type: 'FeatureCollection',
            features: [],
        });

        expect(em.find).toHaveBeenCalledWith(Highlight, { is_approved: true });
    });
});

describe('POST /api/userDashboard/update-username', () => {

   it('should update the user\'s username', async () => {
       const user = {
           email: 'user@example.com',
           password: 'password123',
           isAdmin: false,
           username: '880005553535',
       };

       em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
       em.findOne = vi.fn(async (_entity, condition) => {
           if (condition.username === createdUser.username) {
               return createdUser;
           }
           return null;
       }) as unknown as typeof em.findOne;
       em.count = vi.fn(() => Promise.resolve(0));
       const createdUser = await createUser(em, user);
       const token = await generateToken({
           ...createdUser,
           password: user.password
       });

       const response = await app.request('/api/userDashboard/update-username', {
           method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ oldUsername: '880005553535', newUsername: 'newUsername' }),
       }, mockEnv);
       const responseBody = await response.json();
       logger.warn(responseBody);
       expect(response.status).toBe(200);
   });
    it('should return 400 missing fields', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.username === createdUser.username) {
                return createdUser;
            }
            return null;
        }) as unknown as typeof em.findOne;
        em.count = vi.fn(() => Promise.resolve(0));
        const createdUser = await createUser(em, user);
        const token = await generateToken({
            ...createdUser,
            password: user.password
        });

        const response = await app.request('/api/userDashboard/update-username', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ newUsername: 'newUsername' }),
        }, mockEnv);
        const responseBody = await response.json();
        logger.warn(responseBody);
        expect(response.status).toBe(400);
    });
});

describe('POST /api/userDashboard/update-password', () => {
    it('should update the user\'s password successfully', async () => {
        const user = {
            id: "6859782e-87a8-482e-92bb-54206c7b95dd",
            email: 'user@example.com',
            password: await bcrypt.hash('password123', 10),
            isAdmin: false,
            username: '880005553535',
        };

        em.count = vi.fn(() => Promise.resolve(0));
        const token = await generateToken({
            ...user,
            password: user.password
        });

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === user.id) {
                return user;
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/userDashboard/update-password', {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                oldPassword: 'password123',
                newPassword: 'newPassword123' }),
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        const responseBody = await response.json();
        logger.warn(responseBody);
        expect(response.status).toBe(200);
    });
    it('should return 400 missing fields', async () => {
        const user = {
            id: "6859782e-87a8-482e-92bb-54206c7b95dd",
            email: 'user@example.com',
            password: await bcrypt.hash('password123', 10),
            isAdmin: false,
            username: '880005553535',
        };

        em.count = vi.fn(() => Promise.resolve(0));
        const token = await generateToken({
            ...user,
            password: user.password
        });

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === user.id) {
                return user;
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/userDashboard/update-password', {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                newPassword: 'newPassword123' }),
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        const responseBody = await response.json();
        logger.warn(responseBody);
        expect(response.status).toBe(400);
    });
});

describe('POST /api/highlights/:id/feedbacks', () => {
    it('should successfully submit feedback', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: 'userTest',
        };

        const createdUser = await getUserByEmail(em, user.email) as User;
        const token = await generateToken({
            ...createdUser,
            password: user.password,
        });

        const feedbackData = {
            rating: 5,
            feedbackMessage: 'Great highlight!',
        };

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.email === user.email) {
                return createdUser;
            }
            return null;
        }) as unknown as typeof em.findOne;

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));

        const response = await app.request('/api/highlights/1/feedbacks', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(feedbackData),
        }, mockEnv);

        const responseBody = await response.json();
        expect(response.status).toBe(201);
        expect(responseBody.message).toBe('Feedback submitted successfully');
    });

    it('should return 400 for invalid feedback data', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: 'userTest',
        };

        const createdUser = await getUserByEmail(em, user.email) as User;
        const token = await generateToken({
            ...createdUser,
            password: user.password,
        });

        const invalidFeedbackData = {
            rating: 'notANumber',
            feedbackMessage: 'Great highlight!',
        };

        const response = await app.request('/api/highlights/1/feedbacks', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(invalidFeedbackData),
        }, mockEnv);

        const responseBody = await response.json();
        expect(response.status).toBe(400);
        expect(responseBody.message).toBe('Invalid feedback data');
    });

    it('should return 404 if user is not found', async () => {
        const user = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: 'userTest',
        };

        const createdUser = await getUserByEmail(em, user.email) as User;
        const token = await generateToken({
            ...createdUser,
            password: user.password,
        });

        const feedbackData = {
            rating: 5,
            feedbackMessage: 'Great highlight!',
        };

        em.findOne = vi.fn(async () => null);

        const response = await app.request('/api/highlights/1/feedbacks', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(feedbackData),
        }, mockEnv);

        const responseBody = await response.json();
        expect(response.status).toBe(404);
        expect(responseBody.message).toBe('User not found');
    });

    it('should return 401 if user is not authenticated', async () => {
        const feedbackData = {
            rating: 5,
            feedbackMessage: 'Great highlight!',
        };

        const response = await app.request('/api/highlights/1/feedbacks', {
            method: 'POST',
            body: JSON.stringify(feedbackData),
        }, mockEnv);

        const responseBody = await response.json();
        expect(response.status).toBe(401);
        expect(responseBody.error.code).toBe(401);
        expect(responseBody.error.message).toBe('Unauthorized');
    });
});

describe('GET /api/:id/map/highlights', () => {
    it('should successfully return highlights', async () => {
        const mockGeoJSON = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0],
                    },
                    properties: {
                        id: 1,
                        name: 'Test Highlight',
                        description: 'Test Description',
                        category: 'Test Category',
                    },
                },
            ],
        };

        em.findOne = vi.fn(async () => ({

            highlights: {
                getItems:
                    /**
                     * Handles the GET request to fetch highlights for a specific map.
                     *
                     * @returns {Promise<void>} A promise that resolves when the highlights
                     * are successfully fetched.
                     */
                    () => [{
                    id: 1,
                    name: 'Test Highlight',
                    description: 'Test Description',
                    category: 'Test Category',
                    latitude: 0,
                    longitude: 0,
                }]
            }
        }));

        const response = await app.request('/api/tours/1/map/highlights', {
            method: 'GET'
        }, mockEnv);

        expect(response.status).toBe(200);
        expect(JSON.parse(await response.text())).toEqual({
            geoJSON: mockGeoJSON,
            highlights: expect.any(Array)
        });
    });

    it('should return 404 when no highlights found', async () => {
        em.findOne = vi.fn(async () => ({

            highlights: {
                getItems:
                    /**
                     * Handles the GET request to fetch highlights for a specific map.
                     *
                     * @returns {Promise<Response>} A promise that resolves to
                     * the response object containing the highlights.
                     */
                    () => []

            }
        }));

        const response = await app.request('/api/tours/1/map/highlights', {
            method: 'GET'
        }, mockEnv);

        expect(response.status).toBe(404);
        const text = await response.text();
        expect(JSON.parse(text)).toEqual({ message: 'No highlights found' });
    });

    it('should return 500 on internal error', async () => {
        em.findOne = vi.fn(async () => {
            throw new Error('Database error');
        });

        const response = await app.request('/api/tours/1/map/highlights', {
            method: 'GET'
        }, mockEnv);

        expect(response.status).toBe(500);
        const text = await response.text();
        const body = JSON.parse(text);
        expect(body.error.code).toBe(500);
        expect(body.error.message).toBe('Internal error');
    });
    describe('GET /api/highlights/:id/my-highlights', () => {
        let em: EntityManager;
        let app: Hono<BlankEnv, BlankSchema, "/">;

        beforeEach(async () => {
            em = {
                findOne: vi.fn(),
            } as unknown as EntityManager;

            app = await createApp({
                ALLOWED_HOST: '*',
                ENV: 'test',
                em: em
            });
        });


        it('should return empty array when user has no highlights', async () => {

            /**
             * Mock user data with no highlights.
             */
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                username: 'testuser',
                highlights: {
                    /**
                     * Retrieves the highlights associated with the user.
                     *
                     * @returns {Array} An array of highlight items.
                     */
                    getItems: () => []
                }
            };

            em.findOne = vi.fn().mockResolvedValue(mockUser);

            const token = await generateToken(mockUser);

            const response = await app.request('/api/highlights/my-highlights', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.highlights).toEqual([]);
        });

        it('should return 401 when no token is provided', async () => {
            const response = await app.request('/api/highlights/my-highlights', {
                method: 'GET'
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 when invalid token is provided', async () => {
            const response = await app.request('/api/highlights/my-highlights', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer invalid_token'
                }
            });

            expect(response.status).toBe(401);
        });

        it('should handle user not found', async () => {
            em.findOne = vi.fn().mockResolvedValue(null);

            const token = await generateToken({ email: 'nonexistent@example.com' });

            const response = await app.request('/api/highlights/my-highlights', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.highlights).toEqual([]);
        });

    });
    describe('getHighlightsByUserToken', () => {
        let em: EntityManager;

        beforeEach(() => {
            em = {
                findOne: vi.fn(),
            } as unknown as EntityManager;
        });

        it('should return formatted highlights when user has highlights', async () => {
            const mockUser = {
                /**
                 * The email address of the user.
                 */
                email: 'test@example.com',
                username: 'testuser',
                highlights: {
                    /**
                     * Retrieves the highlights associated with the user.
                     *
                     * @returns {Highlight[]} An array of highlight items.
                     */
                    getItems: () => ([
                        {
                            id: 1,
                            name: 'Test Highlight',
                            description: 'Test Description',
                            category: 'history',
                            latitude: 40.7128,
                            longitude: -74.006,
                            is_approved: true,
                            businessDescription: 'Test Business'
                        }
                    ])
                }
            };

            vi.mocked(em.findOne).mockResolvedValue(mockUser);

            const result = await getHighlightsByUserToken(em, 'test@example.com');

            expect(result).not.toBeNull();
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result?.[0] ?? {}).toEqual({
                id: 1,
                name: 'Test Highlight',
                description: 'Test Description',
                category: 'history',
                latitude: 40.7128,
                longitude: -74.006,
                is_approved: true,
                businessDescription: 'Test Business',
                suggestedBy: {
                    username: 'testuser',
                    email: 'test@example.com'
                }
            });
        });

        it('should return null when user has no highlights', async () => {
            const mockUser = {
                email: 'test@example.com',
                username: 'testuser',
                highlights: {
                    /**
                     * Retrieves the highlights associated with the user.
                     *
                     * @returns {Highlight[]} An array of highlight items.
                     */
                    getItems: () => []
                }
            };

            vi.mocked(em.findOne).mockResolvedValue(mockUser);

            const result = await getHighlightsByUserToken(em, 'test@example.com');
            expect(result).toBeNull();
        });

        it('should return null when user is not found', async () => {
            vi.mocked(em.findOne).mockResolvedValue(null);

            const result = await getHighlightsByUserToken(em, 'nonexistent@example.com');
            expect(result).toBeNull();
        });

        it('should return null when database error occurs', async () => {
            vi.mocked(em.findOne).mockRejectedValue(new Error('Database error'));

            const result = await getHighlightsByUserToken(em, 'test@example.com');
            expect(result).toBeNull();
        });
        /**
         * It should call findOne with correct parameters.
         */
        it('should call findOne with correct parameters', async () => {
            const mockUser = {
                email: 'test@example.com',
                username: 'testuser',
                highlights: {
                    /**
                     * Retrieves the highlights associated with the user.
                     *
                     * @returns {Highlight[]} An array of highlight items.
                     */
                    getItems: () => []
                }
            };

            vi.mocked(em.findOne).mockResolvedValue(mockUser);

            await getHighlightsByUserToken(em, 'test@example.com');

            expect(em.findOne).toHaveBeenCalledWith(
                expect.any(Function),
                { email: 'test@example.com' },
                { populate: ['highlights'] }
            );
        });
    })
});

describe ('PUT /users/:id/trust', () => {
    it('should return 400 if user is not found', async () => {
        const admin = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
            verified: true
        };

        const user = {
            email: 'email@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553536',
            verified: false
        }
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, admin);
        const createdUser = await createUser(em, user);
        const token = await generateToken({
            ...createdAdmin,
            password: admin.password
        });
        em.nativeUpdate = vi.fn(async () => 1);
        const response = await app.request(`/api/users/${createdUser.email}/trust`, {method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User does not exist');
    });

    it('should return 200 if user is trusted', async () => {
        const admin = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
            verified: true
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, admin);

        const token = await generateToken({
            ...createdAdmin,
            password: admin.password
        });
        em.nativeUpdate = vi.fn(async () => 1);
        const response = await app.request(
            `/api/users/${createdAdmin.email}/trust`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(200);
    });

    it('should return 403 if user is not admin', async () => {
        const admin = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
            verified: true
        };

        const user = {
            email: 'email@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553536',
            verified: false
        }
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, admin);
        const createdUser = await createUser(em, user);
        const token = await generateToken({
            ...createdAdmin,
            password: admin.password
        });
        em.nativeUpdate = vi.fn(async () => 1);
        const response = await app.request(`api/users/${createdUser.email}/trust`, {method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }}, mockEnv);

        expect(response.status).toBe(403);

    });

})

describe('GET /api/feedbacks/approval', () => {
    it('should return a list of feedbacks for approval for admin users', async () => {
        const admin = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        };

        const feedbacks = [
            {
                id: 15,
                tour: {},
                highlight: {},
                user: { id: "f9a87494-9003-435e-a576-b72b693d2190", username: "testuser1" },
                rating: 5,
                comment: "awesome",
                is_approved: false
            },
            {
                id: 22,
                tour: { id: 5 },
                highlight: {},
                user: { id: "80215af7-5e2d-4058-b3e8-7ecbc508af92", username: "testuser2" },
                rating: 2,
                comment: "trash",
                is_approved: false
            }
        ];

        em.find = vi.fn().mockResolvedValue(feedbacks);

        const token = await generateToken(admin);

        const response = await app.request('/api/feedbacks/approval', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(feedbacks);
    });
});

describe('GET /api/feedbacks/user/:id', () => {
    it('should return a list of feedbacks for a specific user', async () => {
        const user = {
            id: 'f9a87494-9003-435e-a576-b72b693d2190',
            email: 'user@example.com',
            isAdmin: false
        };
        const token = await generateToken(user);

        const feedbacks = [
            {
                id: 15,
                tour: 3,
                highlight: null,
                user: "f9a87494-9003-435e-a576-b72b693d2190",
                rating: 5,
                comment: "awesome",
                is_approved: false
            }
        ];

        em.find = vi.fn().mockResolvedValue(feedbacks);

        const response = await app.request(`/api/feedbacks/user/${user.id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.feedbacks).toEqual(feedbacks);
    });

    it('should return 404 if no feedbacks are found', async () => {
        const user = {
            id: '80215af7-5e2d-4058-b3e8-7ecbc508af92',
            email: 'user2@example.com',
            isAdmin: false
        };
        const token = await generateToken(user);

        em.find = vi.fn().mockResolvedValue([]);

        const response = await app.request(`/api/feedbacks/user/${user.id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('No feedbacks found for this user');
    });
});

describe('createHighlightWithUser function', () => {
    it('should successfully create a Highlight with user', async () => {
        const emMock = {
            create: vi.fn((entity, data) => ({
                ...data,
                id: 'test-highlight-id',
                users: {
                    add: vi.fn()
                }
            })),
            persistAndFlush: vi.fn().mockResolvedValue(undefined)
        } as unknown as EntityManager;

        const userMock = {
            id: 'test-user-id',
            email: 'user@example.com',
            username: 'testUser',
            highlights: [],
        } as unknown as User;

        const highlightData = {
            name: 'Test Highlight',
            description: 'Just a test highlight',
            category: 'Category',
            businessDescription: 'Some business info',
            latitude: 55.7558,
            longitude: 37.6173,
            is_approved: false,
        };

        await createHighlightWithUser(emMock, highlightData, userMock);

        expect(emMock.create).toHaveBeenCalledWith(Highlight, {
            name: highlightData.name,
            description: highlightData.description,
            category: highlightData.category,
            latitude: highlightData.latitude,
            longitude: highlightData.longitude,
            is_approved: highlightData.is_approved,
            businessDescription: highlightData.businessDescription,
            tours: [],
        });
        expect(emMock.persistAndFlush).toHaveBeenCalledTimes(1);

        const createdHighlight = emMock.create.mock.results[0].value;
        expect(createdHighlight.users.add).toHaveBeenCalledWith(userMock);
    });
});

describe('DELETE /api/highlights/:id/feedbacks/:feedbackId', () => {
    it('should delete specific feedback', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/1', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback deleted successfully');
    });
    it('should return 400 for invalid feedbackId',async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/asd', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 400 for invalid highlightId', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/asdasd/feedbacks/asd', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 404 for non existent feedback', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/100', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(404);
    });
    it('should return 404 for non existent highlight', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/100/feedbacks/1', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(404);
    });
    it('should return 403 for unauthorized user', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        const otherUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        }
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const createdUser = await createUser(em, otherUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdUser,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/1', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(403);
    });
});

describe('PUT /api/highlights/:id/feedbacks/:feedbackId', () => {
    it('should update specific feedback', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/1', {
            method: 'PUT',
            body: JSON.stringify({ rating: 5, comment: 'updated comment' }),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback updated successfully');    });

    it('should return 500 for invalid feedback data', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });

        const response = await app.request('/api/highlights/1/feedbacks/1', {
            method: 'PUT',
            body: { rating: 'invalid', comment: 'updated comment' },
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(500);
    });

    it('should return 404 if feedback not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/2', {
            method: 'PUT',
            body: JSON.stringify({ rating: 5, comment: 'updated comment' }),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        logger.warn( await response.json);

        expect(response.status).toBe(404);
    });
    it('should return 404 if highlight not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/100/feedbacks/2', {
            method: 'PUT',
            body: JSON.stringify({ rating: 5, comment: 'updated comment' }),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        logger.warn( await response.json);

        expect(response.status).toBe(404);
    });
    it('should return 400 if feedbackId invalid', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/1/feedbacks/asd', {
            method: 'PUT',
            body: JSON.stringify({ rating: 5, comment: 'updated comment' }),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        logger.warn( await response.json);

        expect(response.status).toBe(400);
    });
    it('should return 400 if highlightId invalid', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const highlight = {
            id:1,
            name: 'someHighlight',
            description: 'some description',
            category: 'history',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: false
        };

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };
        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Highlight && condition.id == 1) {
                return {
                    ...highlight,
                    users: []
                };
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: highlight.id
                };
            }
            return null;
        }) as unknown as typeof em.findOne;


        const response = await app.request('/api/highlights/asdasd/feedbacks/asd', {
            method: 'PUT',
            body: JSON.stringify({ rating: 5, comment: 'updated comment' }),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        logger.warn( await response.json);

        expect(response.status).toBe(400);
    });
});

describe('DELETE /api/feedbacks/:id', () => {

    it('should delete feedback', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/1', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(200);

    });

    it('should return 404 if feedback not found', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/100', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(404);
    });

    it('should return 403 if user is not authorized', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        const otherUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const createdOtherUser = await createUser(em, otherUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdOtherUser,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/1', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(403);
    });

    it('should return 400 if feedback ID is invalid', async () => {

        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/asdads', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(400);

    });

});

describe('PUT /api/feedbacks/:id', () => {

    it('should update feedback', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/1', {
            method: 'PUT',
            body: JSON.stringify({comment: 'updated comment' },),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(200);
    });

    it('should return 404 if feedback not found', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/100', {
            method: 'PUT',
            body: JSON.stringify({comment: 'updated comment' },),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(404);
    });

    it('should return 403 if user is not authorized', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };
        const otherUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        }
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const createdUser = await createUser(em, otherUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdUser,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/1', {
            method: 'PUT',
            body: JSON.stringify({comment: 'updated comment' },),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(403);
    });

    it('should return 400 if feedback ID is invalid', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/asdasd', {
            method: 'PUT',
            body: JSON.stringify({comment: 'updated comment' },),
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(400);
    });
    it('should return 500 ', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks/asdasd', {
            method: 'PUT',
            body: {comment: 'updated comment' },
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(500);
    });
});

describe('GET /api/feedbacks', () => {
    it('should return all feedbacks', async () => {
        const adminUser = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
        const token = await generateToken({
            ...createdAdmin,
            password: adminUser.password
        });
        em.assign = vi.fn(async () => 1);

        const feedback = {
            rating: 4,
            comment: 'crazy'
        };

        em.findOne = vi.fn(async (entity, condition) => {

            if (entity === User && condition.id === createdAdmin.id) {
                return createdAdmin;
            }
            if (entity === Feedback && condition.id == 1) {
                return {
                    ...feedback,
                    id: 1,
                    user: createdAdmin,
                    highlight: 1,
                    tour: null,
                    is_approved: createdAdmin.isAdmin
                };
            }
            return null;
        }) as unknown as typeof em.findOne;

        const response = await app.request('/api/feedbacks', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        }, mockEnv);

        expect(response.status).toBe(200);
    });

});
describe('GET /api/map/highlights', () => {
    it('should return 500 on error', async () => {
        const mockHighlights = [
            {
                id: 1,
                name: 'Test highlight',
                description: 'Test desc',
                category: 'history',
                latitude: 55.7558,
                longitude: 37.6173,
                is_approved: true,
            },
        ];
        em.find = vi.fn().mockResolvedValue(mockHighlights);

        const response = await app.request('/api/map/highlights', { method: 'GET' }, mockEnv);
        expect(response.status).toBe(500);
    });

    it('should return empty FeatureCollection when no approved highlights exist', async () => {
        em.find = vi.fn().mockResolvedValue([]);

        const response = await app.request('/api/map/highlights', { method: 'GET' }, mockEnv);
        expect(response.status).toBe(200);
    });

    it('should return correct GeoJSON for approved highlights', async () => {
        em.find = vi.fn().mockRejectedValue(new Error('DB error'));

        const response = await app.request('/api/map/highlights', { method: 'GET' }, mockEnv);
        expect(response.status).toBe(200);
    });
});

describe('Tours Routes', () => {
    describe('GET /api/tours', () => {
        it('should return all tours', async () => {
            const mockTours = [{ id: 1, name: 'Tour1' }];
            em.find = vi.fn().mockResolvedValue(mockTours);

            const response = await app.request('/api/tours', { method: 'GET' }, mockEnv);
            expect(response.status).toBe(200);
            const resBody = await response.json();
            expect(resBody).toEqual({ tours: mockTours });
        });
    });

    describe('GET /api/tours/:id', () => {
        it('should return a tour by id', async () => {
            const mockTour = { id: 1, name: 'Tour1' };
            em.findOne = vi.fn().mockResolvedValue(mockTour);

            const response = await app.request('/api/tours/1', { method: 'GET' }, mockEnv);
            expect(response.status).toBe(200);
            const resBody = await response.json();
            expect(resBody).toEqual({ tour: mockTour });
        });

        it('should return 404 if tour not found', async () => {
            em.findOne = vi.fn().mockResolvedValue(null);

            const response = await app.request('/api/tours/999', { method: 'GET' }, mockEnv);
            expect(response.status).toBe(404);
            const resBody = await response.json();
            expect(resBody).toEqual({ message: 'Tour not found' });
        });
    });

    describe('GET /api/tours/:id/highlights', () => {
        it('should return highlights for a tour', async () => {
            const mockHighlights = [{ id: 101, name: 'Highlight1' }];
            em.findOne = vi.fn().mockResolvedValue({

                highlights: {
                    /**
                     * Mock the EntityManager's findOne method to return a highlights list.
                     * @returns {Highlight[]} An array of highlight items.
                     */
                getItems: (): { name: string; id: number }[] => mockHighlights },
            });

            const response = await app.request(
                '/api/tours/1/highlights', { method: 'GET' }, mockEnv
            );
            expect(response.status).toBe(200);
            const resBody = await response.json();
            expect(resBody).toEqual({
                "highlights": {
                "geoJSON": {
                    "features": [
                        {
                        "geometry": {
                            "coordinates": [
                                null,
                                    null,
                                ],
                                "type": "Point",
                        },
                        "properties": {
                            "id": 101,
                                "name": "Highlight1",
                        },
                        "type": "Feature",
                    },
                ],
                    "type": "FeatureCollection",
                },
                "highlights": [
                    {
                    "id": 101,
                        "name": "Highlight1",
                    },
                ],
                },
            });
        });

        it('should return 500 on internal error', async () => {
            em.findOne = vi.fn().mockRejectedValue(new Error('DB error'));

            const response = await app.request(
                '/api/tours/1/highlights', { method: 'GET' }, mockEnv
            );
            expect(response.status).toBe(500);
            const body = await response.json();
            expect(body.error.code).toBe(500);
            expect(body.error.message).toBe('Internal error');
        });
    });

    describe('POST /api/tours', () => {
        it('should create a new tour (admin only)', async () => {
            const adminUser = { email: 'admin@example.com', isAdmin: true };
            const token = await generateToken(adminUser);

            em.create = vi.fn(() => ({ id: 1 }));
            em.persistAndFlush = vi.fn().mockResolvedValue(undefined);

            const body = {
                name: 'New Tour',
                category: 'Historical',
            };

            const response = await app.request('/api/tours', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { Authorization: `Bearer ${token}` },
            }, mockEnv);

            expect(response.status).toBe(201);
            expect(await response.json()).toEqual({ message: 'Tour created successfully' });
        });

        it('should return 400 if invalid data', async () => {
            const adminUser = { email: 'admin@example.com', isAdmin: true };
            const token = await generateToken(adminUser);

            const invalidBody = { category: 'Historical' };

            const response = await app.request('/api/tours', {
                method: 'POST',
                body: JSON.stringify(invalidBody),
                headers: { Authorization: `Bearer ${token}` },
            }, mockEnv);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ message: 'Invalid data' });
        });

        it('should return 401 if not authenticated', async () => {
            const response = await app.request('/api/tours', { method: 'POST' }, mockEnv);
            expect(response.status).toBe(401);
        });

        it('should return 403 if not admin', async () => {
            const user = { email: 'user@example.com', isAdmin: false };
            const token = await generateToken(user);

            const body = { name: 'Some Tour', category: 'Adventure' };

            const response = await app.request('/api/tours', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { Authorization: `Bearer ${token}` },
            }, mockEnv);

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/tours/:id', () => {
        it('should update a tour', async () => {

            const existingTour = { id: 1, name: 'Old Tour' };
            em.findOne = vi.fn().mockResolvedValue(existingTour);

            const newData = { name: 'Updated Tour', category: 'Nature' };
            em.assign = vi.fn();
            em.persistAndFlush = vi.fn();

            const response = await app.request('/api/tours/1', {
                method: 'PUT',
                body: JSON.stringify(newData),
            }, mockEnv);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ message: 'Tour updated successfully' });
        });

        it('should return 404 if tour not found', async () => {
            em.findOne = vi.fn().mockResolvedValue(null);

            const response = await app.request('/api/tours/123', {
                method: 'PUT',
                body: JSON.stringify({ name: 'Updated Tour' }),
            }, mockEnv);

            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ message: 'Tour not found' });
        });

        it('should return 400 if invalid data', async () => {

            const existingTour = { id: 1, name: 'Old Tour' };
            em.findOne = vi.fn().mockResolvedValue(existingTour);

            const invalidBody = { name: 1234 };
            const response = await app.request('/api/tours/1', {
                method: 'PUT',
                body: JSON.stringify(invalidBody),
            }, mockEnv);

            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ message: 'Invalid data' });
        });
    });

    describe('DELETE /api/tours/:id', () => {
        it('should delete a tour (admin only)', async () => {
            const adminUser = { email: 'admin@example.com', isAdmin: true };
            const token = await generateToken(adminUser);

            em.nativeDelete = vi.fn().mockResolvedValue(1);

            const response = await app.request('/api/tours/1', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }, mockEnv);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ message: 'Tour deleted successfully' });
        });

        it('should return 401 if not authenticated', async () => {
            const response = await app.request('/api/tours/1', { method: 'DELETE' }, mockEnv);
            expect(response.status).toBe(401);
        });

        it('should return 403 if not admin', async () => {
            const user = { email: 'user@example.com', isAdmin: false };
            const token = await generateToken(user);

            const response = await app.request('/api/tours/1', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }, mockEnv);

            expect(response.status).toBe(403);
        });
    });
});
