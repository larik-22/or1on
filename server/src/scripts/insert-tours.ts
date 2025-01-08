import { MikroORM } from '@mikro-orm/core';
import mikroConfig from '../../mikro-orm.config.js'
import { Tour } from "../models/tour.js";
import { Highlight } from "../models/highlight.js";

(async () => {
    const orm = await MikroORM.init(mikroConfig);
    const em = orm.em.fork();

    // First, we'll fetch existing highlights
    const highlights = await em.find(Highlight, {});


    /**
     * Helper function to get highlights by category.
     *
     * @param {string} category - The category of highlights to filter by.
     * @returns {Highlight[]} - An array of highlights that match the given category.
     */
    const getHighlightsByCategory = (category: string) =>
        highlights.filter(h => h.category === category);

    const tours = [
        {
            name: 'Tour 1',
            description: 'Educational Tour of Deventer',
            category: 'Education',
            duration_time: '1 hour',
            start_hour: '09:00',
            is_approved: true,
            highlights: [
                ...getHighlightsByCategory('Education'),
                ...highlights.filter(h => h.name === 'Gemeente Deventer')
            ]
        },
        {
            name: 'Tour 2',
            category: 'Architecture',
            description: 'Architectural Highlights of Deventer',
            duration_time: '2 hours',
            start_hour: '10:00',
            highlights: [
                ...getHighlightsByCategory('Architecture'),
                ...highlights.filter(h => h.name === 'De Waag')
            ]
        },
        {
            name: 'Tour 3',
            category: 'Entertainment',
            description: 'Entertainment and Culture Tour',
            duration_time: '1.5 hours',
            start_hour: '11:00',
            highlights: [
                ...getHighlightsByCategory('Entertainment'),
                ...getHighlightsByCategory('Pub'),
                ...highlights.filter(h => h.name === 'Speelgoedmuseum Deventer')
            ]
        },
        {
            name: 'Tour 4',
            category: 'Historical',
            description: 'Historical Deventer Tour',
            duration_time: '3 hours',
            start_hour: '12:00',
            highlights: [
                ...highlights.filter(h => ['De Waag', 'Bergkerk', 'Lebuinuskerk'].includes(h.name)),
                ...getHighlightsByCategory('Historical')
            ]
        },
    ];

    for (const tourData of tours) {
        const tour = new Tour();
        const { highlights: tourHighlights, ...restTourData } = tourData;
        Object.assign(tour, restTourData);

        // Add highlights to the tour
        tour.highlights.add(tourHighlights);

        em.persist(tour);
    }

    await em.flush();
    await orm.close();
})();