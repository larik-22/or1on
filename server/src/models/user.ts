import { Entity, PrimaryKey, Property} from '@mikro-orm/core';

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
}
