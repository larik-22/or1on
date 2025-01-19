import { Entity, PrimaryKey, Property, ManyToMany, Collection} from '@mikro-orm/core';
import { Highlight } from './highlight.js';

/**
 * Represents a user entity in the system.
 */
@Entity()
export class User {
    @PrimaryKey({  type: 'uuid'  })
    id!: string;

    @Property({nullable: true })
    username!: string;

    @Property({ unique: true,nullable: true  })
    email!: string;

    @Property({ nullable: true })
    password!: string;

    @Property()
    isAdmin = false;

    @Property()
    verified = false;
    @ManyToMany(() => Highlight, highlight => highlight.users, { owner: false })
    highlights = new Collection<Highlight>(this);
}
