import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import { generateToken } from '../utils/jwt.js';
import { createUser, getUserByEmail, getAllUsers, getUserById, deleteUser } from '../controllers/userController.js';
import { getFeedbackByUserId, getFeedbackByHighlight, approveFeedback, deleteFeedback } from '../controllers/feedbackController.js'
import { getAllTours, getTourById, getHighlightsByTour, createTour, addUserToTour, updateTour, deleteTour } from "../controllers/tourController.js";
import { getAllHighlights, getHighlightById, createHighlight, approveHighlightSuggestion, updateHighlight, deleteHighlight } from "../controllers/highlightController.js";
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
import {throws} from "node:assert";


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

describe('GET /users', () => {
    it('should fetch all users and only be accessible to admins', async () => {
        const mockUsers = [
            {id: '1', email: 'user@example.com', is_admin: false},
            {id: '2', email: 'admin@example.com', is_admin: true}
        ]

        em.find = vi.fn( async () => mockUsers);

        const response = await app.request('/users', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.users).toEqual(mockUsers);
    });
    it('should return 500 if there is an internal error', async () => {
        em.find = vi.fn( async () => throw new Error('Database error'));

        const response = await app.request('/users', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(500);
        const responseBody = await response.json();
        expect(responseBody.error.message).toEqual('Internal error');
    });
})

describe('GET /users/:id', () => {
    it('should fetch a user and only be accessible to admins', async () => {
        const mockUser = {id: '1', email: 'user@example.com', is_admin: false};

        em.findOne = vi.fn( async (entity, condition) => condition.id === mockUser.id ? mockUser: null);

        const response = await app.request('/users/1', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.user).toEqual(mockUser);
    });
    it('should return 404 if user is not found', async () => {
        em.findOne = vi.fn( async () => null);

        const response = await app.request('/users/2', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User not found');
    });
})

describe('POST /users', () => {
    it('should create a user successfully', async () => {
        const data = {email: 'user@example.com', password: 'somePassword', isAdmin: false};

        em.persistAndFlush = vi.fn(async () => {});

        const response = await app.request('/users', {method: 'POST', body: JSON.stringify(data)}, mockEnv);

        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User created successfully');
        expect(em.persistAndFlush).toHaveBeenCancelled();
    });
    it('should return 400 if user data is invalid', async () => {
        const invalidData = {email: 'user&invalid-hu'};

        const response = await app.request('/users', {method: 'POST', body: JSON.stringify(invalidData)}, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Invalid data');
    });
})

describe('DELETE /users/:id', () => {
    it('should delete user successfully', async () => {
        em.nativeDelete = vi.fn( async () => 1);

        const response = await app.request('/users/1', {method: 'DELETE'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('User deleted successfully');
    });
    it('should return 500 if there is an internal error', async () => {
        em.nativeDelete = vi.fn( async () => throw new Error('Database error'));

        const response = await app.request('/users/1', {method: 'DELETE'}, mockEnv);

        expect(response.status).toBe(500);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Internal error');
    });
})

describe('GET /feedbacks/highlight/:id', () => {
    it('should fetch all feedbacks from a highlight', async () => {
        const feedback = [{id: '1',
            highlight: {id: '1', name: 'something', description: 'someDescription', category: 'history', is_approved: false},
            user: {id: '1', email: 'test@mail1.com', isAdmin: false},
            rating: 4}];

        em.find = vi.fn(async () => feedback);

        const response = await app.request('/feedbacks/highlight/1', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(feedback);
    });
    it('should return 404 if no feedback is found for highlight', async () => {
        em.find = vi.fn( async () => []);

        const response = await app.request('/feedbacks/highlight/10', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('No feedback found');
    });
    it('should return 400 if highlight id is invalid', async () => {
        const response = await app.request('/feedbacks/highlight/invalidHighlightId', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Invalid highlightId parameter');
    });
})

describe('GET /feedbacks/user/:id', () => {
    it('should fetch all feedbacks from a user', async () => {
        const feedback = [{id: '1',
            highlight: {id: '1', name: 'something', description: 'someDescription', category: 'history', is_approved: false},
            user: {id: '1', email: 'test@mail1.com', isAdmin: false},
            rating: 4}];

        em.find = vi.fn(async () => feedback);

        const response = await app.request('/feedbacks/user/1', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(feedback);
    });
    it('should return 404 if no feedback is found for user', async () => {
        em.find = vi.fn( async () => []);

        const response = await app.request('/feedbacks/user/10', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(404);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('No feedback found');
    });
    it('should return 400 if user id is invalid', async () => {
        const response = await app.request('/feedbacks/user/invalidUserId', {method: 'GET'}, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Invalid userId parameter');
    });
})

describe('PUT /feedbacks/:id/approve', () => {
    it('should should approve a highlight suggestion', async () => {
        em.nativeUpdate = vi.fn(async () => 1);

        const response = await app.request('/feedbacks/1/approve', {method: 'PUT'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback approved successfully');
    });
    it('should return 400 for invalid feedback id', async () => {
        const response = await app.request('/feedbacks/invalidId/approve', {method: 'PUT'}, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Invalid feedbackId parameter');
    });
    it('should return 500 if there is an internal error', async () => {
        em.nativeUpdate = vi.fn( async () => throw new Error('Database error'));

        const response = await app.request('/feedbacks/1/approve', {method: 'PUT'}, mockEnv);

        expect(response.status).toBe(500);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Internal error');
    });
})

describe('DELETE /feedbacks/:id', () => {
    it('should delete highlight', async () => {
        em.nativeDelete = vi.fn(async () => 1);

        const response = await app.request('feedbacks/1', {method: 'DELETE'}, mockEnv);

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Feedback deleted successfully');
    });
    it('should return 400 if invalid feedback id', async () => {
        const response = await app.request('feedbacks/invalidFeedbackId', {method: 'DELETE'}, mockEnv);

        expect(response.status).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Invalid feedbackId parameter');
    });
    it('should return 500 if there is an internal error', async () => {
        em.nativeDelete = vi.fn( async () => throw new Error('Database error'));

        const response = await app.request('/feedbacks/1', {method: 'DELETE'}, mockEnv);

        expect(response.status).toBe(500);
        const responseBody = await response.json();
        expect(responseBody.message).toEqual('Internal error');
    });
})

describe('getAllUsers function', () => {
    it('should fetch a list of users', async () => {
        const users = [
            {id: '1', email: 'test@mail1.com', isAdmin: false},
            {id: '2', email: 'test@mail2.com', isAdmin: false}
        ];

        em.find = vi.fn(async () => users);

        const fetchedUsers = getAllUsers(em);

        expect(fetchedUsers).toBeDefined();
        expect(fetchedUsers).toHaveLength(2);
        expect(fetchedUsers[0].id).toBe(users[0].id);
        expect(fetchedUsers[1].id).toBe(users[1].id);
    });
    it('should return null if no users', async () => {
        em.findOne = vi.fn(async () => []);

        const fetchedUsers = getAllUsers(em);

        expect(fetchedUsers).toEqual([]);
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

    it('should return undefined for non-existent user', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedUser = await getUserById(em, 'fakeID');

        expect(fetchedUser).toBeUndefined();
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

        em.find = vi.fn(async (_entity, condition) => {
            if (condition.id === feedback.user.id){
                return feedback;
            }
            return null;
        }) as unknown as typeof em.find;

        const fetchedFeedback = await getFeedbackByUserId(em, feedback.user.id);

        expect(fetchedFeedback).toBeDefined();
        expect(fetchedFeedback).toHaveLength(1)
        expect(fetchedFeedback).toBe(feedback);
    });
    it('should return an empty list if no feedback exists with user ID', async () => {
        em.find = vi.fn(async () => []);

        const fetchedFeedback = await getFeedbackByUserId(em, 'randomId');

        expect(fetchedFeedback).toEqual([]);
    });
});

describe('getFeedbackByHighlight function', () => {
    it('should fetch feedback fo a highlight', async () => {
        const feedback = {
            id: '1',
            highlight: {id: '1',
                name: 'something',
                description: 'some description',
                category: 'history',
                is_approved: false},
            user: {id: '1',
                email: 'user@example.com',
                password: 'password123',
                isAdmin: false,},
            rating: 4,
            comment: 'crazy',
            is_approved: false,
        };

        em.find = vi.fn(async (_entity, condition) => {
            if (condition.id === feedback.user.id){
                return feedback;
            }
            return null;
        }) as unknown as typeof em.find;

        const fetchedFeedback = await getFeedbackByHighlight(em, feedback.highlight.id);

        expect(fetchedFeedback).toBeDefined();
        expect(fetchedFeedback).toHaveLength(1)
        expect(fetchedFeedback).toBe(feedback);
    });
    it('should return an empty list if no feedback exists with highlight ID', async () => {
        em.find = vi.fn(async () => []);

        const fetchedFeedback = await getFeedbackByHighlight(em, '10');

        expect(fetchedFeedback).toEqual([]);
    });
})

describe('approveFeedback function', () => {
    it('should set isApproved to true', async () => {
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

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === feedback.id){
                return feedback;
            }
            return null;
        }) as unknown as typeof em.findOne;

        em.persistAndFlush = vi.fn(async (entity) => entity);

        const updatedFeedback = await approveFeedback(em, feedback.id);

        expect(updatedFeedback).toBeDefined();
    });
    it('should return null if feedback non-existent', async () => {
        em.findOne = vi.fn(async () => null);

        const updatedFeedback = await approveFeedback(em, '20');

        expect(updatedFeedback).toBeNull();
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

        const fetchedTours = getAllTours(em);

        expect(fetchedTours).toBeDefined();
        expect(fetchedTours).toHaveLength(2);
        expect(fetchedTours[0].id).toBe(tours[0].id);
        expect(fetchedTours[1].id).toBe(tours[1].id);
    });
    it('should return null if no tours', async () => {
        em.findOne = vi.fn(async () => []);

        const fetchedTours = getAllTours(em);

        expect(fetchedTours).toEqual([]);
    });
})

describe('getTourById function', () => {
    it('should fetch a tour by id', async () => {
        const tour = {
            id: '1',
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

    it('should return undefined for non-existent tour', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedTours = await getTourById(em, 'fakeID');

        expect(fetchedTours).toBeUndefined();
    });
});

describe('getHighlightsByTour function', () => {
    it('should fetch a list of highlights by tour ID', () => {
        const tour = {
            id: '1',
            name: 'someName',
            highlights: {id: '1',
                name: 'something',
                description: 'some description',
                category: 'history',
                is_approved: false},
        };

        em.find = vi.fn(async (_entity, condition) => {
            if (condition.id === tour.highlights.id){
                return tour;
            }
            return null;
        }) as unknown as typeof em.find;

        const fetchedHighlights = await getHighlightsByTour(em, tour.id);

        expect(fetchedHighlights).toBeDefined();
        expect(fetchedHighlights).toHaveLength(1)
        expect(fetchedHighlights).toBe(tour.highlights);
    });
})

describe('createTour function', () => {
    it('should create a new tour', async () => {
        const tourData = {
            name: 'tourName'
        }

        em.create = vi.fn((entity, data) => ({...data, id: data.id || randomUUID()}));
        const createdTour = await createTour(em, tourData);

        expect(createdTour).toBeDefined();
    });
})

describe('addUserToTour function', () => {
    it('should add a user to a tour', () => {
        const tour = {
            id: '1',
            name: 'someName'
        }

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === tour.id){
                return tour;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const updatedTour = await addUserToTour(em, tour.id, '1');

        expect(updatedTour).toBeDefined();
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

        const updatedTour = await updateTour(em, tour.id, {name: 'newName'});

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
            {id: '1', name: 'something', description: 'someDescription', category: 'history', is_approved: false},
            {id: '2', name: 'somethingElse', description: 'someDescription', category: 'pubs', is_approved: false}
        ];

        em.find = vi.fn(async () => highlights);

        const fetchedHighlights = getAllHighlights(em);

        expect(fetchedHighlights).toBeDefined();
        expect(fetchedHighlights).toHaveLength(2);
        expect(fetchedHighlights[0].id).toBe(highlights[0].id);
        expect(fetchedHighlights[1].id).toBe(highlights[1].id);
    });
    it('should return null if no users', async () => {
        em.findOne = vi.fn(async () => []);

        const fetchedHighlights = getAllHighlights(em);

        expect(fetchedHighlights).toEqual([]);
    });
})

describe('getHighlightById function', () => {
    it('should fetch a highlight by id', async () => {
        const highlight = {id: '2', name: 'somethingElse', description: 'someDescription', category: 'pubs', is_approved: false};

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

    it('should return undefined for non-existent highlight', async () => {
        em.findOne = vi.fn(async () => null);

        const fetchedHighlight = await getHighlightById(em, 'fakeID');

        expect(fetchedHighlight).toBeUndefined();
    });
});

describe('createHighlight function', () => {
    it('should create highlight', async () => {
        const highlightData = {
            name: 'testHighlight',
            description: 'randomText',
            category: 'someCategory',
            longitude: 'someNumber',
            latitude: 'someOtherNumber'
        };

        em.create = vi.fn((entity, data) => ({...data, id: data.id || randomUUID()}));

        const createdHighlight = await createHighlight(em, highlightData);

        expect(createdHighlight).toHaveProperty('id');
        expect(createdHighlight).toHaveProperty('name', highlightData.name);
        expect(createdHighlight).toHaveProperty('description', highlightData.description);
        expect(createdHighlight).toHaveProperty('category', highlightData.category);
        expect(createdHighlight).toHaveProperty('longitude', highlightData.longitude);
        expect(createdHighlight).toHaveProperty('latitude', highlightData.latitude);
    })
})

describe('approveHighlightSuggestion function', () => {
    it('should approve a highlight suggestion', async () => {
        const highlight = {id: '2', name: 'somethingElse', description: 'someDescription', category: 'pubs', is_approved: false};

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id){
                return highlight;
            }
            return null;
        }) as unknown as typeof em.findOne;

        const updatedHighlight = await approveHighlightSuggestion(em, highlight.id);

        expect(updatedHighlight).toBeDefined();
    });
})

describe('updateHighlight function', () => {
    it('should should update existing highlight', async () => {
        const highlight = {id: '2', name: 'somethingElse', description: 'someDescription', category: 'pubs', is_approved: false};

        em.findOne = vi.fn(async (_entity, condition) => {
            if (condition.id === highlight.id){
                return highlight
            }
            return null
        })

        const updatedHighlight = await updateHighlight(em, highlight.id, {name: 'newName'});

        expect(updatedHighlight).toBeDefined();
    });
})

describe('deleteHighlight function', () => {
    it('should delete highlight with given ID', async () => {
        const highlight = {id: '2', name: 'somethingElse', description: 'someDescription', category: 'pubs', is_approved: false};
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
