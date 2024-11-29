import { Highlight } from "./highlight.js";

export interface Tour {
    id: string;
    name: string;
    highlights: Highlight[];
}