import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from './user';
import { Tour } from './tour';

@Entity()
export class TourUser {
    @PrimaryKey()
    user_id!: number;

    @PrimaryKey()
    tour_id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Tour)
    tour!: Tour;
}
