import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Tour } from './tour.js';

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

    @Property()
    category!: string;

    @Property({ type: 'double', nullable: true })
    latitude?: number;

    @Property({ type: 'double', nullable: true })
    longitude?: number;

    @Property({ type: 'boolean', default: false })
    is_approved!: boolean;

    @ManyToMany(() => Tour, (tour) => tour.highlights)
    tours = new Collection<Tour>(this);

}
