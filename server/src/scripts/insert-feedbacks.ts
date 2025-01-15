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
    const user6 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const user8 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const user9 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const user11 = await em.getRepository(User).findOne({username: 'dummyUser3'});
    const admin1 = await em.getRepository(User).findOne({username: 'admin1'});
    const admin2 = await em.getRepository(User).findOne({username: 'admin2'});
    const admin3 = await em.getRepository(User).findOne({username: 'admin3'});

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
            user: admin1.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },
        {
            tour: 1,
            user: user8.id ,
            rating: 3,
            comment: 'starts too early',
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
            user: user11.id ,
            rating: 4,
            comment: 'great places',
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
            user: admin1.id ,
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
            user: admin1.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },
        {
            tour: 3,
            user: user9.id ,
            rating: 5,
            comment: 'awesome',
            is_approved: false
        },
        {
            tour: 3,
            user: admin1.id ,
            rating: 5,
            comment: 'best tour',
            is_approved: true
        },
        {
            tour: 3,
            user: user6.id ,
            rating: 3,
            comment: 'too short',
            is_approved: true
        },
        {
            tour: 4,
            user: user1.id ,
            rating: 5,
            comment: 'perfect',
            is_approved: true
        },
        {
            tour: 4,
            user: user11.id ,
            rating: 3,
            comment: null,
            is_approved: true
        },{
            tour: 5,
            user: user8.id ,
            rating: 4,
            comment: 'great vibes',
            is_approved: true
        },{
            tour: 5,
            user: admin3.id ,
            rating: 3,
            comment: 'had better',
            is_approved: true
        },{
            tour: 5,
            user: user2.id ,
            rating: 2,
            comment: 'trash',
            is_approved: false
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
            user: admin1.id ,
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
            user: admin1.id ,
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
            user: admin1.id ,
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
            user: admin1.id ,
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
            user: admin1.id ,
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
            user: admin1.id ,
            rating: 5,
            comment: 'best place',
            is_approved: true
        },

        /*
        * highlights feedback : Jordenshof
        * */
        {
            highlight: 13,
            user: admin2.id ,
            rating: 5,
            comment: 'beautiful place',
            is_approved: true
        },
        {
            highlight: 13,
            user: user8.id ,
            rating: 4,
            comment: null,
            is_approved: true
        },
        {
            highlight: 13,
            user: user9.id ,
            rating: 4,
            comment: 'beautiful',
            is_approved: true
        },
        {
            highlight: 13,
            user: admin1.id ,
            rating: 5,
            comment: 'great place',
            is_approved: true
        },
        {
            highlight: 13,
            user: user8.id ,
            rating: 3,
            comment: 'mid',
            is_approved: false
        },

        /*
        * highlights feedback : Stadsarchief en Athenaeumbibliotheek
        * */
        {
            highlight: 16,
            user: user3.id ,
            rating: 5,
            comment: 'great',
            is_approved: false
        },

        /*
        * highlights feedback : ICT Netherlands
        * */
        {
            highlight: 17,
            user: user2.id ,
            rating: 3,
            comment: null,
            is_approved: true
        },

        /*
        * highlights feedback : Nieuwe Plantsoen
        * */
        {
            highlight: 18,
            user: user8.id ,
            rating: 5,
            comment: 'I love nature',
            is_approved: true
        },
        {
            highlight: 18,
            user: user9.id ,
            rating: 4,
            comment: 'nice place',
            is_approved: true
        },
        {
            highlight: 18,
            user: user2.id ,
            rating: 5,
            comment: 'beautiful park',
            is_approved: true
        },
        {
            highlight: 18,
            user: user11.id ,
            rating: 1,
            comment: 'I hate nature',
            is_approved: false
        },

        /*
        * highlights feedback : St. Nicholas Church
        * */
        {
            highlight: 20,
            user: user6.id ,
            rating: 4,
            comment: null,
            is_approved: true
        },
        {
            highlight: 20,
            user: user2.id ,
            rating: 5,
            comment: 'beautiful',
            is_approved: true
        },
        {
            highlight: 20,
            user: user1.id ,
            rating: 4,
            comment: null,
            is_approved: false
        },

        /*
        * highlights feedback : De Adelaarshorst Stadium
        * */
        {
            highlight: 21,
            user: user11.id ,
            rating: 4,
            comment: null,
            is_approved: true
        },
        {
            highlight: 21,
            user: user3.id ,
            rating: 5,
            comment: 'love this place',
            is_approved: true
        },
        {
            highlight: 21,
            user: user2.id ,
            rating: 4,
            comment: 'football',
            is_approved: false
        },

        /*
        * highlights feedback : Worpplantsoen Park
        * */
        {
            highlight: 23,
            user: user9.id ,
            rating: 4,
            comment: 'very nice',
            is_approved: true
        },

        /*
        * highlights feedback : St. Lebuinus Church
        * */
        {
            highlight: 25,
            user: user2.id ,
            rating: 4,
            comment: 'beautiful building',
            is_approved: true
        },
        {
            highlight: 25,
            user: user11.id ,
            rating: 5,
            comment: 'the Gothic style is beautiful',
            is_approved: false
        },

        /*
        * highlights feedback : Deventer Buitensociëteit & Bowling
        * */
        {
            highlight: 28,
            user: user9.id ,
            rating: 4,
            comment: null,
            is_approved: true
        },
        {
            highlight: 28,
            user: user1.id ,
            rating: 5,
            comment: 'fun place',
            is_approved: true
        },
        {
            highlight: 28,
            user: user1.id ,
            rating: 5,
            comment: 'great games',
            is_approved: false
        },
        {
            highlight: 28,
            user: admin3.id ,
            rating: 5,
            comment: 'very fun place',
            is_approved: true
        },

        /*
        * highlights feedback : Deventer Buitensociëteit & Bowling
        * */
        {
            highlight: 32,
            user: user8.id ,
            rating: 4,
            comment: null,
            is_approved: true
        },
        {
            highlight: 32,
            user: user6.id ,
            rating: 5,
            comment: 'I love modern art',
            is_approved: true
        },
        {
            highlight: 32,
            user: user11.id ,
            rating: 5,
            comment: 'what even is modern art',
            is_approved: false
        },

        /*
        * highlights feedback : Forsaken escape room
        * */
        {
            highlight: 41,
            user: user8.id ,
            rating: 4,
            comment: 'great place',
            is_approved: true
        },
        {
            highlight: 41,
            user: user3.id ,
            rating: 3,
            comment: null,
            is_approved: false
        },
        {
            highlight: 41,
            user: admin2.id ,
            rating: 5,
            comment: 'very fun place',
            is_approved: true
        },
        {
            highlight: 41,
            user: user11.id ,
            rating: 5,
            comment: 'a lot of fun with friends',
            is_approved: true
        },
        {
            highlight: 41,
            user: user1.id ,
            rating: 3,
            comment: 'kinda boring',
            is_approved: false
        },

        /*
        * highlights feedback : Walhalla Deventer
        * */
        {
            highlight: 44,
            user: user11.id ,
            rating: 4,
            comment: 'great live music',
            is_approved: true
        },
        {
            highlight: 44,
            user: user11.id ,
            rating: 3,
            comment: null,
            is_approved: false
        },

        /*
        * highlights feedback : ZUS. Bar-Kitchen Deventer
        * */
        {
            highlight: 45,
            user: user11.id ,
            rating: 4,
            comment: 'liked the free drinks discount',
            is_approved: false
        },{
            highlight: 45,
            user: user11.id ,
            rating: 5,
            comment: 'yummy food',
            is_approved: true
        },
        {
            highlight: 45,
            user: admin1.id ,
            rating: 5,
            comment: 'I am definitely coming back',
            is_approved: true
        },

        /*
        * highlights feedback : Bar & keuken De buren van Schimmelpenninck
        * */
        {
            highlight: 46,
            user: user8.id ,
            rating: 5,
            comment: 'I love drinking',
            is_approved: true
        },
        {
            highlight: 46,
            user: user9.id ,
            rating: 5,
            comment: 'great food',
            is_approved: true
        },
        {
            highlight: 46,
            user: user2.id ,
            rating: 4,
            comment: null,
            is_approved: true
        }
    ];

    for (const feedbackData of feedbacks) {
        const feedback = new Feedback();
        Object.assign(feedback, feedbackData);
        em.persist(feedback);
    }
    await em.flush();
    await orm.close();
})();
