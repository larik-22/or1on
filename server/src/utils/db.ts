import {MikroORM} from '@mikro-orm/core';
import mikroConfig from '../../mikro-orm.config.js';
import logger from "./logger.js";

/**
 * Initializes MikroORM and returns the connector.
 * @returns {Promise<MikroORM>} The initialized MikroORM instance.
 */
export const getDBConnector = async (): Promise<MikroORM> => {
    return await MikroORM.init(mikroConfig);
};

/**
 * Updates the database schema using the provided MikroORM instance.
 * @param orm - An initialized MikroORM instance.
 */
export const updateDBSchema = async (orm: MikroORM): Promise<void> => {
    try {
        const schemaGenerator = orm.getSchemaGenerator();
        await schemaGenerator.updateSchema();
        logger.info('Schema updated successfully');
    } catch (error) {
        logger.error('Failed to update schema:', {error});
        throw error;
    }
};