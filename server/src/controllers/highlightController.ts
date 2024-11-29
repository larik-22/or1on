import type { Highlight } from "../models/highlight.js";
import { randomUUID } from 'crypto';

let highlights: Highlight[] = [];

export const getAllHighlights = () => {
    return highlights;
}

export const getHighlightById = (id: string) => {
    return highlights.find(highlight => highlight.id === id);
}

export const deleteHighlight = (id: string) => {
    const deletedHighlight = highlights.find(highlight => highlight.id === id);
    highlights = highlights.filter(highlight => highlight.id !== deletedHighlight?.id);
}