import {MikroORM} from "@mikro-orm/core";
import mikroConfig from "../../mikro-orm.config.js";
import {randomUUID} from "crypto";
import {User} from "../models/user.js";
import bcrypt from "bcryptjs";


(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    const users = [
        {
            id: randomUUID(),
            username: 'dummyUser1',
            email: 'user1@dummy.com',
            password: await bcrypt.hash('Password1',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'admin1',
            email: 'admin1@dummy.com',
            password: await bcrypt.hash('Password2',10),
            isAdmin: true
        },
        {
            id: randomUUID(),
            username: 'dummyUser2',
            email: 'user2@dummy.com',
            password: await bcrypt.hash('Password3',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser3',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password4',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'admin2',
            email: 'admin2@dummy.com',
            password: await bcrypt.hash('Password5',10),
            isAdmin: true
        },
        {
            id: randomUUID(),
            username: 'admin3',
            email: 'admin3@dummy.com',
            password: await bcrypt.hash('Password6',10),
            isAdmin: true
        },
        {
            id: randomUUID(),
            username: 'dummyUser4',
            email: 'user4@dummy.com',
            password: await bcrypt.hash('Password7',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser5',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password8',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser6',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password9',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser7',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password10',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser8',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password11',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser9',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password12',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser10',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password13',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser11',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('Password14',10),
            isAdmin: false
        }
    ];

    for (const userData of users) {
        const user = new User();
        Object.assign(user, userData);
        em.persist(user);
    }

    await em.flush();
    await orm.close();
}
)();