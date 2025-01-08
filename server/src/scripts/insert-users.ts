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
            password: await bcrypt.hash('password1',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'admin1',
            email: 'admin1@dummy.com',
            password: await bcrypt.hash('password2',10),
            isAdmin: true
        },
        {
            id: randomUUID(),
            username: 'dummyUser2',
            email: 'user2@dummy.com',
            password: await bcrypt.hash('password3',10),
            isAdmin: false
        },
        {
            id: randomUUID(),
            username: 'dummyUser3',
            email: 'user3@dummy.com',
            password: await bcrypt.hash('password4',10),
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