// Epizeuxis Detector
// Detects immediate repetition of a word for emphasis

export function detectEpizeuxis(text) {
    const results = [];

    // Pattern: word, punctuation (optional), same word
    // Example: "Never, never, never" or "Yes! Yes! Yes!"
    const pattern = /\b(\w+)\s*[,;!]?\s*\1\b/gi;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        const word = match[1];

        // Skip very short words (likely false positives)
        if (word.length < 3) continue;

        // Skip common words that repeat naturally
        const skipWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'it', 'to'];
        if (skipWords.includes(word.toLowerCase())) continue;

        const startIndex = match.index;
        const fullMatch = match[0];

        results.push({
            word: fullMatch,
            startIndex: startIndex,
            endIndex: startIndex + fullMatch.length,
            device: 'epizeuxis',
            category: 'repetition'
        });
    }

    return results;
}
