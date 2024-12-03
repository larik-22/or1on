import { MikroORM } from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './src/models/user.js';
import dotenv from 'dotenv';
import { Tour } from './src/models/tour.js';
import {Feedback} from "./src/models/feedback.js";
import {TourFeedback} from "./src/models/tour_feedback.js";
import {Highlight} from "./src/models/highlight.js";

dotenv.config();

export default {
    entities: [User, Tour, Highlight, Feedback, TourFeedback],
    driver: PostgreSqlDriver,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: true,
    metadataProvider: TsMorphMetadataProvider,
} as Parameters<typeof MikroORM.init>[0];
