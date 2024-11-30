import { MikroORM } from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './src/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

export default {
    entities: [User],
    driver: PostgreSqlDriver,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: true,
    metadataProvider: TsMorphMetadataProvider,
} as Parameters<typeof MikroORM.init>[0];
