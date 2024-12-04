import { MikroORM } from '@mikro-orm/core';
import { Highlight } from '../models/highlight.js'
import mikroConfig from '../../mikro-orm.config.js'

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const highlights = [
        {
            name: 'Highlight 1',
            description: 'Description for highlight 1',
            category: 'Category A',
            latitude: 52.2543,
            longitude: 6.1682,
            is_approved: true,
        },
        {
            name: 'Highlight 2',
            description: 'Description for highlight 2',
            category: 'Category B',
            latitude: 48.8566,
            longitude: 2.3522,
            is_approved: false,
        },
        {
            name: 'Highlight 3',
            description: 'Description for highlight 3',
            category: 'Category G',
            latitude: 34.0522,
            longitude: -118.2437,
            is_approved: true,
        },
        {
            name: 'Highlight 4',
            description: 'Description for highlight 4',
            category: 'Category C',
            latitude: 51.5074,
            longitude: -0.1278,
            is_approved: false,
        },
        {
            name: 'Highlight 5',
            description: 'Description for highlight 5',
            category: 'Category D',
            latitude: 40.7128,
            longitude: -74.0060,
            is_approved: true,
        },
    ];
    for (const highlightData of highlights) {
        const highlight = new Highlight();
        Object.assign(highlight, highlightData);
        em.persist(highlight);
    }
    await em.flush();
    await orm.close();
})();
