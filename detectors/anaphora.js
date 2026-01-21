// Anaphora Detector
// Detects repetition of words/phrases at the beginning of successive sentences or clauses

export function detectAnaphora(text) {
    const results = [];

    // Split by sentence-ending punctuation and semicolons (which mark clauses)
    const sentences = text.split(/[.!?;]+/).filter(s => s.trim().length > 0);

    if (sentences.length < 2) return results;

    for (let i = 0; i < sentences.length - 1; i++) {
        const currentSentence = sentences[i].trim();
        const nextSentence = sentences[i + 1].trim();

        if (!currentSentence || !nextSentence) continue;

        // Get first 1-3 words of each sentence
        const currentWords = currentSentence.split(/\s+/).slice(0, 3);
        const nextWords = nextSentence.split(/\s+/).slice(0, 3);

        // Check for matching start (1, 2, or 3 words)
        for (let len = 3; len >= 1; len--) {
            const currentPhrase = currentWords.slice(0, len).map(w => w.toLowerCase()).join(' ');
            const nextPhrase = nextWords.slice(0, len).map(w => w.toLowerCase()).join(' ');

            if (currentPhrase === nextPhrase && currentPhrase.length > 0) {
                // Found anaphora! Find position in original text
                const phraseText = currentWords.slice(0, len).join(' ');
                const startIndex = text.indexOf(currentSentence);

                // Only add if we haven't already detected this phrase
                const alreadyDetected = results.some(r =>
                    r.startIndex === startIndex && r.word.toLowerCase() === phraseText.toLowerCase()
                );

                if (!alreadyDetected && startIndex !== -1) {
                    results.push({
                        word: phraseText,
                        startIndex: startIndex,
                        endIndex: startIndex + phraseText.length,
                        device: 'anaphora',
                        category: 'repetition'
                    });
                }

                break; // Use the longest match
            }
        }
    }

    return results;
}
