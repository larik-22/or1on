import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Tour } from './tour';

/**
 * Represents a highlight entity.
 */
@Entity()
export class Highlight {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    description!: string;

    @Property({ nullable: true })
    category?: string;

    @Property({ type: 'double', nullable: true })
    latitude?: number;

    @Property({ type: 'double', nullable: true })
    longitude?: number;

    @Property({type: 'boolean',nullable: true})
    is_approved? = false;

    @ManyToMany(() => 'Tour', (tour) => tour.highlights)
    tours = new Collection<Tour>(this);

}
