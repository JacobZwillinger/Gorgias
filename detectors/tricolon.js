// Tricolon Detector
// Detects series of three parallel words, phrases, or clauses

export function detectTricolon(text) {
    const results = [];

    // Pattern 1: Three items separated by commas and "and"
    // Example: "X, Y, and Z" or "X, Y and Z"
    const tricolonPattern = /\b(\w+),\s+(\w+),?\s+and\s+(\w+)\b/gi;
    let match;

    while ((match = tricolonPattern.exec(text)) !== null) {
        const fullMatch = match[0];
        const startIndex = match.index;

        results.push({
            word: fullMatch,
            startIndex: startIndex,
            endIndex: startIndex + fullMatch.length,
            device: 'tricolon',
            category: 'structure'
        });
    }

    // Pattern 2: Three sentences/clauses with semicolons
    // Example: "X; Y; Z"
    const clausePattern = /([^;.!?]+);([^;.!?]+);([^;.!?]+)(?:[.!?]|$)/g;

    while ((match = clausePattern.exec(text)) !== null) {
        const fullMatch = match[0];
        const startIndex = match.index;

        // Check if the three clauses are roughly similar in length (parallel structure indicator)
        const clause1 = match[1].trim();
        const clause2 = match[2].trim();
        const clause3 = match[3].trim();

        const len1 = clause1.length;
        const len2 = clause2.length;
        const len3 = clause3.length;
        const avgLen = (len1 + len2 + len3) / 3;

        // If clauses are within 50% of average length, likely parallel
        if (Math.abs(len1 - avgLen) / avgLen < 0.5 &&
            Math.abs(len2 - avgLen) / avgLen < 0.5 &&
            Math.abs(len3 - avgLen) / avgLen < 0.5) {

            results.push({
                word: fullMatch.trim(),
                startIndex: startIndex,
                endIndex: startIndex + fullMatch.length,
                device: 'tricolon',
                category: 'structure'
            });
        }
    }

    return results;
}
