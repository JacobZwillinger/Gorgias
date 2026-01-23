// Alliteration Detector
// Detects repetition of initial consonant sounds using phonetic analysis
// Handles silent letters, homophones, and function word filtering

// Function words to skip when detecting alliteration
const FUNCTION_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'for',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'it', 'its', 'that', 'this', 'these', 'those',
    'we', 'us', 'our', 'you', 'your', 'he', 'she', 'they', 'them', 'their',
    'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
    'not', 'no'
]);

// Silent letter patterns - maps word prefixes to their actual starting sound
const SILENT_LETTER_PATTERNS = [
    { pattern: /^kn/i, sound: 'N' },    // knight, know, knee
    { pattern: /^gn/i, sound: 'N' },    // gnome, gnat, gnaw
    { pattern: /^pn/i, sound: 'N' },    // pneumonia
    { pattern: /^ps/i, sound: 'S' },    // psychology, psalm
    { pattern: /^pt/i, sound: 'T' },    // pterodactyl
    { pattern: /^wr/i, sound: 'R' },    // write, wrong, wrist
    { pattern: /^wh/i, sound: 'W' },    // what, where, when (treat as W)
    { pattern: /^ph/i, sound: 'F' },    // phone, philosophy
    { pattern: /^rh/i, sound: 'R' },    // rhetoric, rhyme
];

/**
 * Get the first consonant sound from a word
 * Uses the actual starting letter, with special handling for silent letters
 * Returns null for function words or vowel-initial words
 */
function getFirstConsonantSound(word) {
    const lowerWord = word.toLowerCase();

    // Skip function words
    if (FUNCTION_WORDS.has(lowerWord)) {
        return null;
    }

    // Check for silent letter patterns
    for (const { pattern, sound } of SILENT_LETTER_PATTERNS) {
        if (pattern.test(lowerWord)) {
            return sound;
        }
    }

    // Use the actual first letter
    const firstLetter = lowerWord[0].toUpperCase();

    // Skip vowel-initial words
    if (['A', 'E', 'I', 'O', 'U'].includes(firstLetter)) {
        return null;
    }

    return firstLetter;
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

    // Sliding window to find CONSECUTIVE alliteration clusters
    // Allow at most 1 function word between alliterative content words
    const MAX_FUNCTION_WORDS_BETWEEN = 1;

    let i = 0;
    while (i < words.length - 2) {
        const currentWord = words[i];
        const consonantSound = getFirstConsonantSound(currentWord.text);

        // Skip if no consonant sound detected (function words or vowel-initial)
        if (!consonantSound) {
            i++;
            continue;
        }

        // Look for consecutive words with the same starting sound
        const cluster = [currentWord];
        let j = i + 1;
        let functionWordCount = 0;

        while (j < words.length) {
            const nextWord = words[j];
            const nextSound = getFirstConsonantSound(nextWord.text);

            if (nextSound === null) {
                // Function word or vowel-initial
                functionWordCount++;
                if (functionWordCount > MAX_FUNCTION_WORDS_BETWEEN) {
                    // Too many function words - break the chain
                    break;
                }
                j++;
                continue;
            }

            if (nextSound === consonantSound) {
                cluster.push(nextWord);
                functionWordCount = 0; // Reset counter after finding a match
                j++;
            } else {
                // Non-matching content word - stop here
                break;
            }
        }

        // If we found 3+ consecutive alliterative content words, record it
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
            i = j;
        } else {
            i++;
        }
    }

    return results;
}
