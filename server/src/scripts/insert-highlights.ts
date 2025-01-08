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
            category: 'Education',
            latitude: 52.25395899363234,
            longitude: 6.168077222882274,
            is_approved: true,
            businessDescription: 'Free entrance',
        },
        {
            name: 'Train Station',
            description: 'Description for Train Station',
            category: 'Architecture',
            latitude: 52.257260692798816,
            longitude: 6.160759143013088,
            is_approved: false,
            businessDescription: 'Free entrance',
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
            category: 'Architecture',
            latitude: 52.251890934161125,
            longitude: 6.156158081679511,
            is_approved: true,
            businessDescription: 'Free entrance',
        },
        /*
        * 52., 6.
        * old :
        *   latitude: 52.256801,
            longitude: 6.161126,*/
        {
            name: 'Deventer Schouwburg',
            description: 'Description for Deventer Schouwburg',
            category: 'Entertainment',
            latitude: 52.25578355247537,
            longitude: 6.161575568185643,
            is_approved: true,
            businessDescription: 'Free entrance',
            /*
            * old:
            * latitude: 52.2555,
            longitude: 6.1635,
            */
        },
        {
            name: 'Bergkerk',
            description: 'Description for Bergkerk',
            category: 'Architecture',
            latitude: 52.252305375211606,
            longitude: 6.163154492373404,
            is_approved: true,
            businessDescription: 'Free entrance',
            /*
            * old:
            * latitude: 52.2542,
            longitude: 6.1628,
            */
        },
        {
            name: 'De Waag',
            description: 'Description for De Waag',
            category: 'Historical',
            latitude: 52.251619030495384,
            longitude: 6.159927081679525,
            is_approved: true,
            businessDescription: 'Free entrance',
            /*
            * old:
            * latitude: 52.2550,
            * longitude: 6.1630,
            * */
        },
        {
            name:'Speelgoedmuseum Deventer',
            description: 'Description for Speelgoedmuseum Deventer',
            category: 'Museum',
            latitude: 52.25117910093484,
            longitude: 6.15975603139713,
            businessDescription: 'Free entrance',
            is_approved: true,
        },
        {
            name:'Rijsterborgherpark',
            description: 'Description for Rijsterborgherpark',
            category: 'Nature',
            latitude:52.25793634903742,
            longitude:6.1528628565387935,
            is_approved: true,
            businessDescription: 'Free entrance',
        },
        {
            name: 'Lebuinuskerk',
            description: 'Description for Lebuinuskerk',
            category: 'Architecture',
            latitude: 52.255905,
            longitude: 6.1614,
            is_approved: false,
            businessDescription: 'Free entrance',
        },
        {
            name:'Topicus Deventer',
            description: 'Description for Topicus',
            category: 'IT Company',
            latitude: 52.255888165742576,
            longitude: 6.1601082383985775,
            is_approved: true,
            businessDescription: 'Free entrance',
        },
        {
            name:'The Irish Elk',
            description: 'Irish pub',
            category: 'Pub',
            latitude: 52.25210734031344,
            longitude: 6.160778624008953,
            is_approved: true,
            businessDescription: 'Free entrance',
        }
    ];

    for (const highlightData of highlights) {
        const highlight = new Highlight();
        Object.assign(highlight, highlightData);
        em.persist(highlight);
    }

    await em.flush();
    await orm.close();
})();