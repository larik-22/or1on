import { Tour } from "../models/tour.js";

let tours: Tour[] = [];

export const getAllTours = () => {
    return tours;
}

export const getTourById = (id: string) => {
    return tours.find(tour => tour.id === id);
}

export const deleteTour = (id: string) => {
    const deletedTour = tours.find(tour => tour.id === id);
    tours = tours.filter(tour => tour.id !== deletedTour?.id);
}