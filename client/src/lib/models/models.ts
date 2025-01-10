// temp file, put all models in separate files soon
import type {Feature} from "geojson";

/**
 * Represents a highlight entity in the system. Going to be extended
 */
export type Highlight = {
	id: number;
	name: string;
};

/**
 * Represents a tour entity in the system. Going to be extended
 */
export interface Tour {
	id: number;
	name: string;
	description: string;
	highlights: Highlight[];
}

/**
 * Represents a user entity in the system.
 */
export interface User {
	id: string;
	username: string;
	email: string;
}

/**
 * Represents a feedback entity in the system.
 */
export interface Feedback {
	id: number;
	highlight: Highlight | null;
	user: User;
	rating: number;
	comment: string;
	businessOffer: string | null;
}

/**
 * Enum for highlight types
 */
export enum HighlightType {
	EDUCATION = "Education",
	ARCHITECTURE = "Architecture",
	ENTERTAINMENT = "Entertainment",
	HISTORICAL = "Historical",
	MUSEUM = "Museum",
	NATURE = "Nature",
	IT_COMPANY = "IT Company",
	PUB = "Pub",
	OTHER = "Other"
}

/**
 * Type for highlight properties
 */
export interface HighlightProperties {
	id: number;
	name: string;
	description: string;
	category: HighlightType;
}

/**
 * Extended GeoJSON feature with specific properties
 */
export interface HighlightFeature extends Feature {
	properties: HighlightProperties;
}