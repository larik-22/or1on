import {HighlightType} from "../models/models";

/**
 * Maps highlight types to colors
 */
const highlightTypeToColor: Record<HighlightType, string> = {
	[HighlightType.OTHER]: "#e0e0e0",
	[HighlightType.EDUCATION]: "#ff9800",
	[HighlightType.ARCHITECTURE]: "#e57373",
	[HighlightType.ENTERTAINMENT]: "#f44336",
	[HighlightType.HISTORICAL]: "#ec407a",
	[HighlightType.MUSEUM]: "#8e24aa",
	[HighlightType.NATURE]: "#4caf50",
	[HighlightType.IT_COMPANY]: "#2196f3",
	[HighlightType.PUB]: "#ffc107"
};


/**
 * Returns the color associated with a given highlight type
 * @param highlightType The highlight type
 * @returns The color associated with the highlight type
 */
export const getHighlightColor = (highlightType: HighlightType): string => {
	return highlightTypeToColor[highlightType] || highlightTypeToColor[HighlightType.OTHER];
}