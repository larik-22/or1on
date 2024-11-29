import { Feedback } from "./feedback.js";

export interface Highlight {
    id: string;
    name: string;
    feedback: Feedback[];
}