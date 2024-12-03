import { Entity, PrimaryKey, Property, ManyToOne, OneToMany } from '@mikro-orm/core';
import { User } from './user';
import { TourFeedback } from './tour_feedback';
import { TourHighlight } from './tour_highlight';
import { TourUser } from './tour_user';
import {Collection} from "@mikro-orm/postgresql";

@Entity()
export class Tour {
    @PrimaryKey()
    tour_id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property()
    duration_time!: string;

    @Property()
    start_hour!: string;

    @OneToMany(() => TourFeedback, feedback => feedback.tour)
    feedbacks = new Collection<TourFeedback>(this);

    @OneToMany(() => TourHighlight, highlight => highlight.tour)
    highlights = new Collection<TourHighlight>(this);

    @OneToMany(() => TourUser, tourUser => tourUser.tour)
    users = new Collection<TourUser>(this);
}
