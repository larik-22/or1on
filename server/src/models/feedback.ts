import { Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/core';
import { Tour } from './tour.js';
import { Highlight } from './highlight.js';
import { User } from './user.js';


/**
 * Represents a tour entity.
 */
@Entity()
export class Feedback {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Tour, { nullable: true })
    tour?: Tour;

    @ManyToOne(() => Highlight, { nullable: true })
    highlight?: Highlight;

    @ManyToOne(() => User)
    user!: User;

    @Property()
    rating!: number;

    @Property({ nullable: true })
    comment?: string;

    @Property({ default: false })
    is_approved = false;
}
