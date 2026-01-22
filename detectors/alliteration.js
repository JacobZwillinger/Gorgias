// Alliteration Detector
// Detects repetition of initial consonant sounds using phonetic analysis
// Handles silent letters, homophones, and function word filtering

import { metaphone } from 'metaphone';

// Function words to skip when detecting alliteration
const FUNCTION_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'for',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'it', 'its', 'that', 'this', 'these', 'those'
]);

/**
 * Get the first consonant sound from a word using Metaphone
 * Returns null for function words or vowel-initial words
 */
function getFirstConsonantSound(word) {
    const lowerWord = word.toLowerCase();

    // Skip function words
    if (FUNCTION_WORDS.has(lowerWord)) {
        return null;
    }

    // Get phonetic representation
    const phonetic = metaphone(word);

    if (!phonetic || phonetic.length === 0) {
        return null;
    }

    // Get first character of phonetic code
    const firstSound = phonetic[0].toUpperCase();

    // Skip vowel-initial words (vowels in Metaphone are usually preserved)
    if (['A', 'E', 'I', 'O', 'U'].includes(firstSound)) {
        return null;
    }

    return firstSound;
}

/**
 * Detect alliteration in text
 * Returns array of alliteration instances with their positions
 */
export function detectAlliteration(text) {
    const results = [];

    // Split into sentences to avoid cross-sentence matching
    const sentencePattern = /[^.!?]+[.!?]+/g;
    let sentenceMatch;

    while ((sentenceMatch = sentencePattern.exec(text)) !== null) {
        const sentence = sentenceMatch[0];
        const sentenceStart = sentenceMatch.index;
        const sentenceResults = detectAlliterationInSentence(sentence, sentenceStart);
        results.push(...sentenceResults);
    }

    return results;
}

/**
 * Detect alliteration within a single sentence
 */
function detectAlliterationInSentence(sentence, sentenceStartIndex) {
    const results = [];

    // Extract words with their positions in original text
    const wordPattern = /\b[a-zA-Z]+\b/g;
    const words = [];
    let match;

    while ((match = wordPattern.exec(sentence)) !== null) {
        words.push({
            text: match[0],
            startIndex: sentenceStartIndex + match.index,
            endIndex: sentenceStartIndex + match.index + match[0].length
        });
    }

    if (words.length < 3) {
        return results;
    }

    // Sliding window to find alliteration clusters
    let i = 0;
    while (i < words.length) {
        const currentWord = words[i];
        const consonantSound = getFirstConsonantSound(currentWord.text);

        // Skip if no consonant sound detected
        if (!consonantSound) {
            i++;
            continue;
        }

        // Look ahead within a window of 8 words to find matching sounds
        const cluster = [currentWord];

        for (let j = i + 1; j < Math.min(i + 8, words.length); j++) {
            const nextWord = words[j];
            const nextSound = getFirstConsonantSound(nextWord.text);

            if (nextSound === consonantSound) {
                cluster.push(nextWord);
            }
        }

        // If we found 3+ alliterative words, record it
        if (cluster.length >= 3) {
            const firstWord = cluster[0];
            const lastWord = cluster[cluster.length - 1];
            const phraseText = sentence.substring(
                firstWord.startIndex - sentenceStartIndex,
                lastWord.endIndex - sentenceStartIndex
            );

            results.push({
                word: phraseText,
                startIndex: firstWord.startIndex,
                endIndex: lastWord.endIndex,
                device: 'alliteration',
                category: 'sound',
                metadata: {
                    sound: consonantSound,
                    count: cluster.length
                }
            });

            // Skip past this cluster to avoid overlapping detections
            i = words.indexOf(lastWord) + 1;
        } else {
            i++;
        }
    }

    return results;
}
