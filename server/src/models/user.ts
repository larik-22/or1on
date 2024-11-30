import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Represents a user entity in the system.
 */
@Entity()
export class User {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @Property({ unique: true })
    email!: string;

    @Property()
    password!: string;

    @Property()
    isAdmin = false;
}