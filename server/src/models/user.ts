import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Tour } from './tour';

/**
 * Represents a user entity in the system.
 */
@Entity()
export class User {
    @PrimaryKey({  type: 'uuid'  })
    id!: string;

    @Property({ unique: true, nullable: true })
    username!: string;

    @Property({ unique: true,nullable: true  })
    email!: string;

    @Property({ nullable: true })
    password!: string;

    @Property()
    isAdmin = false;

    @ManyToMany(() => 'Tour', (tour) => tour.users)
    tours = new Collection<Tour>(this);
}
