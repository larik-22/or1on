import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { TourUser } from './tour_user';
import {Collection} from "@mikro-orm/postgresql";  // Import TourUser to establish the relationship

@Entity()
export class User {
    @PrimaryKey()
    user_id!: number;

    @Property({ unique: true })
    username!: string;

    @Property({ unique: true })
    email!: string;

    @Property()
    password_hash!: string;

    @Property({ default: false })
    is_admin: boolean = false;

    // One-to-many relationship with the TourUser entity
    @OneToMany(() => TourUser, tourUser => tourUser.user)
    tours = new Collection<TourUser>(this);  // A user can participate in many tours
}
