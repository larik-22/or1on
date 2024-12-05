import {HighlightType} from "../models/models";

/**
 * Maps highlight types to colors
 */
const highlightTypeToColor: Record<HighlightType, string> = {
	[HighlightType.CATEGORY_A]: "#fda762",
	[HighlightType.CATEGORY_B]: "#00FF00",
	[HighlightType.CATEGORY_C]: "#0000FF",
	[HighlightType.CATEGORY_D]: "#FFFF00",
	[HighlightType.CATEGORY_G]: "#6f7eca",
	[HighlightType.Default]: "#FFFFFF"

}

/**
 * Returns the color associated with a given highlight type
 * @param highlightType The highlight type
 * @returns The color associated with the highlight type
 */
export const getHighlightColor = (highlightType: HighlightType): string => {
	return highlightTypeToColor[highlightType] || highlightTypeToColor[HighlightType.Default];
}