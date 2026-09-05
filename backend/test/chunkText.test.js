import chunkText from "../utils/chunkText.js";

describe("chunkText", () => {
    test("should return empty array for empty text", () => {
        const result = chunkText("");
        expect(result).toEqual([]);
    });

    test("should return empty array for whitespace-only text", () => {
        const result = chunkText("   \n   \t   ");
        expect(result).toEqual([]);
    });

    test("should return one chunk when text is smaller than chunk size", () => {
        const text = "This is a short text.";
        const result = chunkText(text, 100, 20);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(text);
    });

    test("should split long text into multiple chunks", () => {
        const text = "a".repeat(1000);
        const result = chunkText(text, 200, 50);
        expect(result.length).toBeGreaterThan(1);
    });

    test("should create chunks with the correct maximum size", () => {
        const text = "a".repeat(1000);
        const result = chunkText(text, 200, 50);
        result.forEach(chunk => {
            expect(chunk.length).toBeLessThanOrEqual(200);
        });
    });

    test("should throw error when overlap is greater than or equal to chunk size", () => {
        expect(() => {
            chunkText("This is some text", 100, 100);
        }).toThrow("CHUNK_OVERLAP must be smaller than CHUNK_SIZE");
    });

    test("should throw error when overlap is greater than chunk size", () => {
        expect(() => {
            chunkText("This is some text", 100, 150);
        }).toThrow("CHUNK_OVERLAP must be smaller than CHUNK_SIZE");
    });
});