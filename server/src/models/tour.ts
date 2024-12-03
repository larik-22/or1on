import { Entity, PrimaryKey, Property, ManyToMany, Collection,} from '@mikro-orm/core';
import { User } from './user';
import { Highlight } from './highlight';


/**
 * Represents a tour entity.
 */
@Entity()
export class Tour {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ type: 'interval', nullable: true })
    duration_time?: string;

    @Property({ type: 'time', nullable: true })
    start_hour?: string;

    @ManyToMany(() => 'User', (user) => user.tours, { owner: true })
    users = new Collection<User>(this);

    @ManyToMany(() => 'Highlight', (highlight) => highlight.tours, { owner: true })
    highlights = new Collection<Highlight>(this);

}
