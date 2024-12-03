import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Highlight } from './highlight';
import { User } from './user';

/**
 * Represents feedback for a highlight.
 */
@Entity()
export class Feedback {
    @PrimaryKey()
    feedback_id!: number;

    @ManyToOne(() => 'Highlight')
    highlight!: Highlight;

    @ManyToOne(() => 'User')
    user!: User;

    @Property()
    rating!: number;

    @Property({ nullable: true })
    comment?: string;

    @Property({ default: false })
    is_approved: boolean = false;

}
