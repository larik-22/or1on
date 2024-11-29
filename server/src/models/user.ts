import type {Feedback} from "./feedback.js";

export interface User {
    id: string;
    email: string;
    password: string;
    isAdmin: boolean;
    feedback: Feedback[];
}