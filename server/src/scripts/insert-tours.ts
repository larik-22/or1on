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
            duration_time: '02:00',
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
            duration_time: '02:00',
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
            duration_time: '01:30',
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
            duration_time: '03:00',
            start_hour: '12:00',
            highlights: [
                ...highlights.filter(h => ['De Waag', 'Bergkerk', 'Lebuinuskerk'].includes(h.name)),
                ...getHighlightsByCategory('Historical')
            ]
        },
        {
            name: 'Tour 5',
            category: 'Pub',
            description: 'Deventer Pub Crawl',
            duration_time: '03:00',
            start_hour: '20:00',
            highlights: [
                ...getHighlightsByCategory('Pub')
            ]
        },
        {
            name: 'Tour 6',
            category: 'Nature',
            description: 'Parks Around Deventer',
            duration_time: '02:00',
            start_hour: '16:00',
            highlights: [
                ...getHighlightsByCategory('Nature')
            ]
        },
        {
            name: 'Tour 7',
            category: 'Architecture',
            description: 'Churches Around Deventer',
            duration_time: '03:00',
            start_hour: '14:00',
            highlights: [
                ...highlights.filter(h => ['De Waag', 'Bergkerk', 'Lebuinuskerk',
                    'St. Nicholas Church', 'Broederenkerk', 'Koningskerk'].includes(h.name))
            ]
        },
        {
            name: 'Tour 8',
            category: 'Museum',
            description: 'Museums Around Deventer',
            duration_time: '02:10',
            start_hour: '15:30',
            highlights: [
                ...getHighlightsByCategory('Museum')
            ]
        },
        {
            name: 'Tour 9',
            category: 'Historical',
            description: 'Historical Districts in Deventer',
            duration_time: '00:40',
            start_hour: '14:00',
            highlights: [
                ...highlights.filter(h => ['Bergkwartier', 'De Brink Square'].includes(h.name))
            ]
        },
        {
            name: 'Tour 10',
            category: 'IT Company',
            description: 'IT Companies Around Deventer',
            duration_time: '00:45',
            start_hour: '15:00',
            highlights: [
                ...getHighlightsByCategory('IT Company')
            ]
        },
        {
            name: 'Tour 11',
            category: 'Pub',
            description: 'Dine and Dash Tour',
            duration_time: '00:40',
            start_hour: '18:00',
            highlights: [
                ...highlights.filter(h => ['ZUS. Bar-Kitchen Deventer',
                    'Bar & keuken De buren van Schimmelpenninck'].includes(h.name))
            ]
        }
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