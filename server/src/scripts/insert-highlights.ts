import { MikroORM } from '@mikro-orm/core';
import { Highlight } from '../models/highlight.js';
import mikroConfig from '../../mikro-orm.config.js';

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const highlights = [
        {
            name: 'Saxion',
            description: 'Description for Saxion',
            category: 'Category A',
            latitude: 52.25395899363234,
            longitude: 6.168077222882274,
            is_approved: true,
        },
        {
            name: 'Train Station',
            description: 'Description for Train Station',
            category: 'Category B',
            latitude: 52.257260692798816,
            longitude: 6.160759143013088,
            is_approved: false,
            /*old :
            *
            latitude: 52.2515,
            longitude: 6.160031,
            *
            * */
        },
        {
            name: 'Gemeente Deventer',
            description: 'Description for Gemeente',
            category: 'Category G',
            latitude: 52.251890934161125,
            longitude: 6.156158081679511,
            is_approved: true,
        },
        /*
        * 52., 6.
        * old :
        *   latitude: 52.256801,
            longitude: 6.161126,*/
        {
            name: 'Deventer Schouwburg',
            description: 'Description for Deventer Schouwburg',
            category: 'Category C',
            latitude: 52.25578355247537,
            longitude: 6.161575568185643,
            is_approved: true,
            /*
            * old:
            * latitude: 52.2555,
            longitude: 6.1635,
            */
        },
        {
            name: 'Bergkerk',
            description: 'Description for Bergkerk',
            category: 'Category D',
            latitude: 52.252305375211606,
            longitude: 6.163154492373404,
            is_approved: true,
            /*
            * old:
            * latitude: 52.2542,
            longitude: 6.1628,
            */
        },
        {
            name: 'De Waag',
            description: 'Description for De Waag',
            category: 'Category E',
            latitude: 52.251619030495384,
            longitude: 6.159927081679525,
            is_approved: true,
            /*
            * old:
            * latitude: 52.2550,
            * longitude: 6.1630,
            * */
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