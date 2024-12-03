import { Entity, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Tour } from './tour';
import { Highlight } from './highlight';

@Entity()
export class TourHighlight {
    @PrimaryKey()
    tour_id!: number;

    @PrimaryKey()
    highlight_id!: number;

    @ManyToOne(() => Tour)
    tour!: Tour;

    @ManyToOne(() => Highlight)
    highlight!: Highlight;
}
