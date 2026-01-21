// Alliteration Detector
// Detects repetition of the same consonant sound at the beginning of neighboring words
// Requires 3+ words with same starting sound to reduce false positives

export function detectAlliteration(text) {
    const results = [];
    const words = text.match(/\b[a-zA-Z]+\b/g);

    if (!words || words.length < 3) return results;

    // Helper function to get first consonant
    const getFirstConsonant = (word) => {
        const firstChar = word[0].toLowerCase();
        // Skip common small words that don't count for alliteration
        const skipWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'for', 'with', 'that', 'this', 'these', 'those', 'it', 'is', 'as', 'be', 'by'];
        if (skipWords.includes(word.toLowerCase())) {
            return null;
        }
        return /[bcdfghjklmnpqrstvwxyz]/.test(firstChar) ? firstChar : null;
    };

    // Look for clusters of 3+ alliterative words within a window
    let i = 0;
    while (i < words.length - 2) {
        const cluster = [];
        const consonant = getFirstConsonant(words[i]);

        if (!consonant) {
            i++;
            continue;
        }

        // Check next 5 words for same consonant
        for (let j = i; j < Math.min(i + 6, words.length); j++) {
            const wordConsonant = getFirstConsonant(words[j]);
            if (wordConsonant === consonant) {
                cluster.push({ word: words[j], index: j });
            }
        }

        // Only flag if we have 3+ alliterative words
        if (cluster.length >= 3) {
            // Find the full phrase in the original text
            const firstWord = cluster[0].word;
            const lastWord = cluster[cluster.length - 1].word;

            let startPos = 0;
            let foundStart = -1;

            // Find accurate position accounting for previous matches
            while (true) {
                foundStart = text.indexOf(firstWord, startPos);
                if (foundStart === -1) break;

                // Check if this position hasn't been used
                const alreadyUsed = results.some(r =>
                    r.startIndex <= foundStart && foundStart < r.endIndex
                );

                if (!alreadyUsed) break;
                startPos = foundStart + 1;
            }

            if (foundStart !== -1) {
                const endPos = text.indexOf(lastWord, foundStart) + lastWord.length;
                const phrase = text.substring(foundStart, endPos);

                results.push({
                    word: phrase,
                    startIndex: foundStart,
                    endIndex: endPos,
                    device: 'alliteration',
                    category: 'sound'
                });
            }

            // Skip ahead to avoid overlapping detections
            i = cluster[cluster.length - 1].index;
        }

        i++;
    }

    return results;
}
