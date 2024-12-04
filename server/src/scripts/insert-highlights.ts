import { MikroORM } from '@mikro-orm/core';
import { Highlight } from '../models/highlight.js'
import mikroConfig from '../../mikro-orm.config.js'

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const highlights = [
        {
            name: 'Saxion',
            description: 'Description for Saxion',
            category: 'Category A',
            latitude: 52.254298,
            longitude: 6.168155,
            is_approved: true,
        },
        {
            name: 'Train Station',
            description: 'Description for Train Station',
            category: 'Category B',
            latitude: 52.2515,
            longitude: 6.160031,
            is_approved: false,
        },
        {
            name: 'Gemeente Deventer',
            description: 'Description for Gemeente',
            category: 'Category G',
            latitude: 52.256801,
            longitude: 6.161126,
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
