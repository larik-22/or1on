import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Feedback } from './feedback';
import { TourHighlight } from './tour_highlight';
import {Collection} from "@mikro-orm/postgresql";

@Entity()
export class Highlight {
    @PrimaryKey()
    highlight_id!: number;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property({ nullable: true })
    category?: string;

    @Property({ nullable: true })
    latitude?: number;

    @Property({ nullable: true })
    longitude?: number;

    @OneToMany(() => Feedback, feedback => feedback.highlight)
    feedbacks = new Collection<Feedback>(this);

    @OneToMany(() => TourHighlight, tourHighlight => tourHighlight.highlight)
    tours = new Collection<TourHighlight>(this);
}
