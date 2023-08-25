import { isUUID } from "./utils";

describe('isUUID', () => {

    // Tests that the function correctly identifies a valid UUID string.
    it('should return true when input is a valid UUID string', () => {
      expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    // Tests that the function returns false for an empty string.
    it('should return false when input is an empty string', () => {
      expect(isUUID('')).toBe(false);
    });

    // Tests that the function returns false for an invalid UUID string.
    it('should return false when input is an invalid UUID string', () => {
      expect(isUUID('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
    });
});
