import { MikroORM } from '@mikro-orm/core';
import mikroConfig from '../../mikro-orm.config.js'
import {Tour} from "../models/tour.js";

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const tours = [
        {
            name: 'Tour 1',
            description: 'Description for Tour 1',
            duration_time: '1 hour',
            start_hour: '09:00',
            is_approved: true,
        },
        {
            name: 'Tour 2',
            description: 'Description for Tour 2',
            duration_time: '2 hours',
            start_hour: '10:00',
        },
        {
            name: 'Tour 3',
            description: 'Description for Tour 3',
            duration_time: '1.5 hours',
            start_hour: '11:00',
        },
        {
            name: 'Tour 4',
            description: 'Description for Tour 4',
            duration_time: '3 hours',
            start_hour: '12:00',
        },
        ];

    for (const tourData of tours) {
        const tour = new Tour();
        Object.assign(tour, tourData);
        em.persist(tour);
    }

    await em.flush();
    await orm.close();
})();
