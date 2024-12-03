import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user';
import { Highlight } from './highlight';

@Entity()
export class Feedback {
    @PrimaryKey()
    feedback_id!: number;

    @ManyToOne(() => Highlight)
    highlight!: Highlight;

    @ManyToOne(() => User)
    user!: User;

    @Property()
    rating!: number;

    @Property()
    comment!: string;

    @Property({ default: false })
    is_approved: boolean = false;

}
