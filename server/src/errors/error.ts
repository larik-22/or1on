/**
 * Represents the structure of an error response.
 */
interface ErrorResponse {
    error: {
        code: number;
        message: string;
    };
}

/**
 * Creates a standardized error response object.
 *
 * @param code - The HTTP status code representing the error.
 * @param message - A message describing the error.
 * @returns An object conforming to the ErrorResponse interface.
 */
export const createErrorResponse = (code: number, message: string): ErrorResponse => ({
    error: {
        code,
        message,
    },
});
