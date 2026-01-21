// Rhetorical Question Detector
// Detects questions that are asked for effect rather than to get an answer

export function detectRhetoricalQuestion(text) {
    const results = [];

    // Find all sentences ending with ?
    const questionPattern = /([^.!?]*\?)/g;
    let match;

    while ((match = questionPattern.exec(text)) !== null) {
        const question = match[1].trim();

        if (question.length > 0) {
            const startIndex = match.index;
            const endIndex = startIndex + match[0].length;

            results.push({
                word: question + '?',
                startIndex: startIndex,
                endIndex: endIndex,
                device: 'rhetorical_question',
                category: 'emphasis'
            });
        }
    }

    return results;
}
