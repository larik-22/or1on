import { Entity, PrimaryKey, Property, ManyToMany, Collection, OneToMany } from '@mikro-orm/core';
import { User } from './user';
import { Highlight } from './highlight';
import { TourFeedback } from './tour_feedback.js';

/**
 * Represents a tour entity.
 */
@Entity()
export class Tour {
    @PrimaryKey()
    tour_id!: number;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ type: 'interval', nullable: true })
    duration_time?: string;

    @Property({ type: 'time', nullable: true })
    start_hour?: string;

    @ManyToMany(() => 'User', (user) => user.tours, { owner: true })
    users = new Collection<User>(this); // Many-to-Many relationship with users

    @ManyToMany(() => 'Highlight', (highlight) => highlight.tours, { owner: true })
    highlights = new Collection<Highlight>(this); // Many-to-Many relationship with highlights

    @OneToMany(() => 'TourFeedback', (tourFeedback) => tourFeedback.tour)
    feedback = new Collection<TourFeedback>(this); // One-to-Many with TourFeedback
}
