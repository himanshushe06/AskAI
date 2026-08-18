const chunkText = ( text,
                    chunkSize = Number(process.env.CHUNK_SIZE || 1000),
                    chunkOverlap = Number(process.env.CHUNK_OVERLAP || 200)
    ) => {
    const cleanText = text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    if (!cleanText) {
        return [];
    }

    if (chunkOverlap >= chunkSize) {
        throw new Error("CHUNK_OVERLAP must be smaller than CHUNK_SIZE");
    }

    const chunks = [];
    let start = 0;

    while (start < cleanText.length) {
        const end = Math.min(start + chunkSize, cleanText.length);
        const chunk = cleanText.slice(start, end).trim();
        if (chunk) {
            chunks.push(chunk);
        }

        if (end === cleanText.length) {
            break;
        }
        start = end - chunkOverlap;
    }

    return chunks;
    };

export default chunkText;