export enum HighlightType {
  CATEGORY_A = "Category A",
  CATEGORY_B = "Category B",
  CATEGORY_C = "Category C",
  CATEGORY_D = "Category D",
}

/**
 * Maps highlight types to colors
 */
const highlightTypeToColor: Record<HighlightType, string> = {
    [HighlightType.CATEGORY_A]: "#FF0000",
    [HighlightType.CATEGORY_B]: "#00FF00",
    [HighlightType.CATEGORY_C]: "#0000FF",
    [HighlightType.CATEGORY_D]: "#FFFF00",
}

/**
 * Returns the color associated with a given highlight type
 * @param highlightType The highlight type
 * @returns The color associated with the highlight type
 */
export const getHighlightColor = (highlightType: HighlightType): string => {
    return highlightTypeToColor[highlightType];
}