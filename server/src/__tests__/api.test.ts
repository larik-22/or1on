import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { generateToken } from '../utils/jwt.js';
import { createUser, getUserByEmail } from '../controllers/userController.js';
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


const mockEnv = {
    ALLOWED_HOST: '*',
    ENV: 'test',
};

let em: EntityManager;
let app: Hono<BlankEnv, BlankSchema, "/">;

beforeEach(() => {
    em = {
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
    } as unknown as EntityManager;

    app = createApp(em);
});

afterEach(() => {
    vi.resetModules();
});

describe('POST /auth', () => {
    it('should successfully register a user', async () => {
        const userData = {
            email: 'user@example.com',
            password: 'password123',
            isAdmin: false,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        em.findOne = vi.fn(async () => null);

        const response = await app.request('/auth', {
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

        const response = await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(adminData),
        }, mockEnv);

        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('User registered successfully');
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
            username: '880005553535',
        };

        const response = await app.request('/auth', {
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

        const response = await app.request('/auth', {
            method: 'POST',
            body: JSON.stringify(missingFieldsData),
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(400);
        expect(responseBody.error.message).toBe('Invalid registration data');
    });
});

describe('POST /auth/tokens', () => {
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

        const response = await app.request('/auth/tokens', {
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

    it('should return 400 if missing required fields', async () => {
        const missingFieldsData = { email: 'user@example.com' };

        const response = await app.request('/auth/tokens', {
            method: 'POST',
            body: JSON.stringify(missingFieldsData),
        }, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(400);
        expect(responseBody.error.message).toBe('Invalid login data');
    });
});

describe('GET /test/protected', () => {
    it('should be accessible to logged-in users with valid token', async () => {
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

        const response = await app.request('/test/protected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe(`Hello, ${user.email}! This is a protected route.`);
    });

    it('should be accessible to admin users with valid token', async () => {
        const admin = {
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, admin);
        const token = await generateToken({
            ...createdAdmin,
            password: admin.password
        });

        const response = await app.request('/test/protected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        }, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe(`Hello, ${admin.email}! This is a protected route.`);
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

    it('should return 401 for invalid token', async () => {
        const response = await app.request('/test/protected', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer invalid_token' },
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
            username: '880005553535',
        };
        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdAdmin = await createUser(em, adminUser);
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
            username: '880005553535',
        };

        em.create = vi.fn((entity, data) => ({ ...data, id: data.id || randomUUID() }));
        const createdUser = await createUser(em, user);
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

    it('should return 401 for unauthenticated users', async () => {
        const response = await app.request('/test/adminprotected', {
            method: 'GET',
        }, mockEnv);

        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.error.code).toBe(401);
        expect(responseBody.error.message).toBe('Unauthorized');
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

    describe('Middleware: isLoggedIn', () => {
        it('should return 401 for empty token', async () => {
            const response = await app.request('/test/protected', {
                method: 'GET',
                headers: { 'Authorization': '' },
            }, mockEnv);

            expect(response.status).toBe(401);
            const responseBody = await response.json();
            expect(responseBody.error.code).toBe(401);
            expect(responseBody.error.message).toBe('Unauthorized');
        });

        it('should return 401 for expired token', async () => {
            const expiredToken = 'expired_token_example';
            const response = await app.request('/test/protected', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${expiredToken}` },
            }, mockEnv);

            expect(response.status).toBe(401);
            const responseBody = await response.json();
            expect(responseBody.error.code).toBe(401);
            expect(responseBody.error.message).toBe('Unauthorized');
        });
    });
});

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

describe('POST /userDashboard/update-username', () => {
   it('should update the user\'s username', async () => {

   });
});
