// API endpoint for analyzing text and detecting rhetorical devices
import { metaphone } from 'metaphone';

// Function words to skip when detecting alliteration
const FUNCTION_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'for',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'it', 'its', 'that', 'this', 'these', 'those'
]);

/**
 * Get the first consonant sound from a word using Metaphone
 */
function getFirstConsonantSound(word) {
    const lowerWord = word.toLowerCase();
    if (FUNCTION_WORDS.has(lowerWord)) {
        return null;
    }
    const phonetic = metaphone(word);
    if (!phonetic || phonetic.length === 0) {
        return null;
    }
    const firstSound = phonetic[0].toUpperCase();
    if (['A', 'E', 'I', 'O', 'U'].includes(firstSound)) {
        return null;
    }
    return firstSound;
}

/**
 * Detect alliteration within a single sentence
 */
function detectAlliterationInSentence(sentence, sentenceStartIndex) {
    const results = [];
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

    let i = 0;
    while (i < words.length) {
        const currentWord = words[i];
        const consonantSound = getFirstConsonantSound(currentWord.text);

        if (!consonantSound) {
            i++;
            continue;
        }

        const cluster = [currentWord];
        for (let j = i + 1; j < Math.min(i + 8, words.length); j++) {
            const nextWord = words[j];
            const nextSound = getFirstConsonantSound(nextWord.text);
            if (nextSound === consonantSound) {
                cluster.push(nextWord);
            }
        }

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

            i = words.indexOf(lastWord) + 1;
        } else {
            i++;
        }
    }

    return results;
}

/**
 * Detect alliteration in text
 */
function detectAlliteration(text) {
    const results = [];
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
 * Main analysis function
 */
export function analyzeText(text) {
    if (!text || typeof text !== 'string') {
        return { devices: [], text: '' };
    }

    const devices = [];
    const alliterations = detectAlliteration(text);
    devices.push(...alliterations);

    return {
        text,
        devices,
        summary: {
            total: devices.length,
            byType: {
                alliteration: alliterations.length
            }
        }
    };
}

// Vercel serverless function handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const result = analyzeText(text);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ error: 'Analysis failed' });
    }
}
