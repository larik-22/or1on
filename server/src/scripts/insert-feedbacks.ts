import { MikroORM } from '@mikro-orm/core';
import mikroConfig from '../../mikro-orm.config.js'
import {Feedback} from "../models/feedback.js";
import {User} from "../models/user.js";

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const user1 = await em.getRepository(User).findOne({username: 'dummyUser1'});
    const user2 = await em.getRepository(User).findOne({username: 'dummyUser2'});
    const user3 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const admin = await em.getRepository(User).findOne({username: 'admin1'});

    const feedbacks = [
        {
            tour: 1,
            user: user1.id ,
            rating: 5,
            comment: 'Great Tour',
            is_approved: true
        },
        {
            tour: 1,
            user: user2.id ,
            rating: 4,
            comment: 'almost perfect tour',
            is_approved: true
        },
        {
            tour: 1,
            user: user3.id ,
            rating: 5,
            comment: 'Great tour',
            is_approved: true
        },
        {
            tour: 1,
            user: admin.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },
        {
            tour: 2,
            user: user1.id ,
            rating: 5,
            comment: 'Great Tour',
            is_approved: true
        },
        {
            tour: 2,
            user: user2.id ,
            rating: 4,
            comment: 'almost perfect tour',
            is_approved: true
        },
        {
            tour: 2,
            user: user3.id ,
            rating: 5,
            comment: 'Great tour',
            is_approved: true
        },
        {
            tour: 2,
            user: admin.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },
        {
            tour: 3,
            user: user1.id ,
            rating: 5,
            comment: 'Great Tour',
            is_approved: true
        },
        {
            tour: 3,
            user: user2.id ,
            rating: 4,
            comment: 'almost perfect tour',
            is_approved: true
        },
        {
            tour: 3,
            user: user3.id ,
            rating: 5,
            comment: 'Great tour',
            is_approved: true
        },
        {
            tour: 3,
            user: admin.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },

        /*
        * highlights feedback : Saxion
        * */
        {
            highlight: 1,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 1,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 1,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 1,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },
        /*
        * highlights feedback : train station
        * */
        {
            highlight: 2,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 2,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 2,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 2,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },

        /*
        * highlights feedback : gemeente deventer
        * */
        {
            highlight: 3,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 3,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 3,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 3,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },

        /*
        * highlights feedback : schouwburg deventer
        * */
        {
            highlight: 4,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 4,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 4,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 4,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },

        /*
        * highlights feedback : bergkerk
        * */
        {
            highlight: 5,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 5,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 5,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 5,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },

        /*
        * highlights feedback : De Waag
        * */
        {
            highlight: 6,
            user: user1.id ,
            rating: 5,
            comment: 'Greatest place',
            is_approved: true
        },
        {
            highlight: 6,
            user: user2.id ,
            rating: 5,
            comment: 'Great place',
            is_approved: true
        },
        {
            highlight: 6,
            user: user3.id ,
            rating: 2,
            comment: 'not that Great',
            is_approved: true
        },
        {
            highlight: 6,
            user: admin.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },


    ];

    for (const feedbackData of feedbacks) {
        const feedback = new Feedback();
        Object.assign(feedback, feedbackData);
        em.persist(feedback);
    }
    await em.flush();
    await orm.close();
})();
