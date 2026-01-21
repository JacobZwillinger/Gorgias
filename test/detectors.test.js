// Unit tests for rhetorical device detectors
// Run with: npm test (after setting up Jest/Mocha)

import { detectAnaphora } from '../detectors/anaphora.js';
import { detectAlliteration } from '../detectors/alliteration.js';
import { detectRhetoricalQuestion } from '../detectors/rhetorical-question.js';
import { detectTricolon } from '../detectors/tricolon.js';
import { detectEpizeuxis } from '../detectors/epizeuxis.js';
import { analyzeText } from '../mock-api.js';

describe('Anaphora Detector', () => {
    test('detects basic anaphora', () => {
        const text = 'We shall fight on the beaches. We shall fight on the landing grounds.';
        const results = detectAnaphora(text);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('anaphora');
        expect(results[0].category).toBe('repetition');
    });

    test('detects multi-word anaphora', () => {
        const text = 'I have a dream that one day. I have a dream that my children.';
        const results = detectAnaphora(text);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].word.toLowerCase()).toContain('i have');
    });

    test('does not detect false positives', () => {
        const text = 'The cat sat. A dog ran. Some birds flew.';
        const results = detectAnaphora(text);
        expect(results.length).toBe(0);
    });

    test('handles empty text', () => {
        const results = detectAnaphora('');
        expect(results).toEqual([]);
    });

    test('handles single sentence', () => {
        const results = detectAnaphora('Just one sentence here.');
        expect(results).toEqual([]);
    });
});

describe('Alliteration Detector', () => {
    test('detects basic alliteration', () => {
        const text = 'Peter Piper picked a peck of pickled peppers.';
        const results = detectAlliteration(text);
        expect(results.length).toBeGreaterThan(2);
    });

    test('detects adjacent word alliteration', () => {
        const text = 'Big bad bear.';
        const results = detectAlliteration(text);
        expect(results.length).toBeGreaterThan(0);
    });

    test('ignores articles', () => {
        const text = 'The cat and the dog and the bird.';
        const results = detectAlliteration(text);
        const hasThe = results.some(r => r.word.toLowerCase() === 'the');
        expect(hasThe).toBe(false);
    });

    test('handles empty text', () => {
        const results = detectAlliteration('');
        expect(results).toEqual([]);
    });

    test('handles non-alliterative text', () => {
        const text = 'Quick brown zebra.';
        const results = detectAlliteration(text);
        expect(results.length).toBe(0);
    });
});

describe('Rhetorical Question Detector', () => {
    test('detects single question', () => {
        const text = 'Who controls the past?';
        const results = detectRhetoricalQuestion(text);
        expect(results.length).toBe(1);
        expect(results[0].device).toBe('rhetorical_question');
    });

    test('detects multiple questions', () => {
        const text = 'Can we? Will we? Should we?';
        const results = detectRhetoricalQuestion(text);
        expect(results.length).toBe(3);
    });

    test('does not detect statements', () => {
        const text = 'This is a statement. This is another.';
        const results = detectRhetoricalQuestion(text);
        expect(results.length).toBe(0);
    });

    test('handles empty text', () => {
        const results = detectRhetoricalQuestion('');
        expect(results).toEqual([]);
    });
});

describe('Tricolon Detector', () => {
    test('detects classic tricolon', () => {
        const text = 'I came, I saw, I conquered.';
        const results = detectTricolon(text);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('tricolon');
    });

    test('detects tricolon with "and"', () => {
        const text = 'Life, liberty, and the pursuit of happiness.';
        const results = detectTricolon(text);
        expect(results.length).toBeGreaterThan(0);
    });

    test('does not detect pairs', () => {
        const text = 'First, second.';
        const results = detectTricolon(text);
        expect(results.length).toBe(0);
    });

    test('handles empty text', () => {
        const results = detectTricolon('');
        expect(results).toEqual([]);
    });
});

describe('Epizeuxis Detector', () => {
    test('detects immediate repetition', () => {
        const text = 'Never, never, never give up.';
        const results = detectEpizeuxis(text);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('epizeuxis');
    });

    test('detects repetition without punctuation', () => {
        const text = 'Yes yes yes!';
        const results = detectEpizeuxis(text);
        expect(results.length).toBeGreaterThan(0);
    });

    test('ignores short words', () => {
        const text = 'It it is is.';
        const results = detectEpizeuxis(text);
        expect(results.length).toBe(0);
    });

    test('handles empty text', () => {
        const results = detectEpizeuxis('');
        expect(results).toEqual([]);
    });
});

describe('Integration: Full Analysis', () => {
    test('analyzes text and returns correct structure', () => {
        const text = 'We shall fight. We shall win. Will we succeed?';
        const result = analyzeText(text);

        expect(result).toHaveProperty('originalText');
        expect(result).toHaveProperty('highlights');
        expect(result).toHaveProperty('markers');
        expect(result.originalText).toBe(text);
        expect(Array.isArray(result.highlights)).toBe(true);
        expect(typeof result.markers).toBe('object');
    });

    test('groups markers by category', () => {
        const text = 'We shall fight. We shall win. Peter Piper picked peppers.';
        const result = analyzeText(text);

        if (Object.keys(result.markers).length > 0) {
            const categories = Object.keys(result.markers);
            expect(categories.length).toBeGreaterThan(0);

            // Check that categories contain device counts
            categories.forEach(category => {
                expect(typeof result.markers[category]).toBe('object');
            });
        }
    });

    test('handles empty text', () => {
        const result = analyzeText('');
        expect(result.highlights.length).toBe(0);
        expect(Object.keys(result.markers).length).toBe(0);
    });

    test('handles very long text', () => {
        const text = 'This is a sentence. '.repeat(1000);
        const result = analyzeText(text);
        expect(result).toBeDefined();
        expect(result.originalText).toBe(text);
    });

    test('handles special characters', () => {
        const text = 'What!? Can we #win? Yes, yes, yes!';
        const result = analyzeText(text);
        expect(result).toBeDefined();
        expect(result.highlights).toBeDefined();
    });
});

describe('Edge Cases', () => {
    test('handles only punctuation', () => {
        const result = analyzeText('!?.,;:');
        expect(result.highlights.length).toBe(0);
    });

    test('handles only numbers', () => {
        const result = analyzeText('123 456 789');
        expect(result.highlights.length).toBe(0);
    });

    test('handles mixed languages', () => {
        const text = 'Hello world. Bonjour monde.';
        const result = analyzeText(text);
        expect(result).toBeDefined();
    });

    test('handles newlines and tabs', () => {
        const text = 'Line 1\nLine 2\tTabbed';
        const result = analyzeText(text);
        expect(result.originalText).toBe(text);
    });
});
