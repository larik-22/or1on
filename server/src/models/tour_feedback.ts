import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Tour } from './tour';
import { User } from './user';

@Entity()
export class TourFeedback {
    @PrimaryKey()
    tour_feedback_id!: number;

    @ManyToOne(() => Tour)
    tour!: Tour;

    @ManyToOne(() => User)
    user!: User;

    @Property()
    rating!: number;

    @Property()
    comment!: string;
}
