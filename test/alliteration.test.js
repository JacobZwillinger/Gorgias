// Test suite for alliteration detector
import { detectAlliteration } from '../detectors/alliteration.js';

describe('Alliteration Detector', () => {
    test('detects simple P-alliteration', () => {
        const text = 'Peter Piper picked a peck of pickled peppers perfectly.';
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        expect(results[0].metadata.sound).toBe('P');
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(6);
    });

    test('detects B-alliteration with function word filtering', () => {
        const text = 'The brave bold boys battled bravely beyond belief.';
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        expect(results[0].metadata.sound).toBe('B');
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(6);
        // Should not include "The" in the count
        expect(results[0].word.startsWith('The')).toBe(false);
    });

    test('detects PH=F phonetic alliteration', () => {
        const text = "Phil's phonetic phrases favor fantastic philosophy.";
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        expect(results[0].metadata.sound).toBe('F');
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(5);
    });

    test('detects silent K in knight/knew/nothing', () => {
        const text = 'The knight knew nothing new about navigation.';
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        expect(results[0].metadata.sound).toBe('N');
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(4);
    });

    test('detects G-alliteration (phonetically K)', () => {
        const text = "Garry's gregarious grandfather greatly enjoyed gorgeous green gardens.";
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        // Metaphone converts hard G to K phonetically
        expect(results[0].metadata.sound).toBe('K');
        // Only 6 G-words (enjoyed starts with E phonetically)
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(6);
    });

    test('detects C-alliteration with multiple C-words', () => {
        const text = 'Clever cats carefully catch crafty crows and cunning crickets consistently.';
        const results = detectAlliteration(text);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('alliteration');
        expect(results[0].metadata.sound).toBe('K');
        // 7 C-words (and is a function word, skipped)
        expect(results[0].metadata.count).toBeGreaterThanOrEqual(7);
    });

    test('does NOT detect vowel-initial words', () => {
        const text = 'An apple and an orange sat alone.';
        const results = detectAlliteration(text);

        expect(results.length).toBe(0);
    });

    test('does NOT detect only 2 words', () => {
        const text = 'A big bird sang.';
        const results = detectAlliteration(text);

        expect(results.length).toBe(0);
    });

    test('does NOT detect when no pattern exists', () => {
        const text = 'Time flies like an arrow.';
        const results = detectAlliteration(text);

        expect(results.length).toBe(0);
    });

    test('does NOT detect random text', () => {
        const text = 'Silent letters make no sense.';
        const results = detectAlliteration(text);

        expect(results.length).toBe(0);
    });

    test('comprehensive test: detects 6 instances in mixed text', () => {
        const text = `Peter Piper picked a peck of pickled peppers perfectly. An apple and an orange sat alone. The brave bold boys battled bravely beyond belief. Time flies like an arrow. Phil's phonetic phrases favor fantastic philosophy. The knight knew nothing new about navigation. Garry's gregarious grandfather greatly enjoyed gorgeous green gardens. A big bird sang. Clever cats carefully catch crafty crows and cunning crickets consistently. Silent letters make no sense.`;
        const results = detectAlliteration(text);

        // Should detect exactly 6 instances of alliteration
        expect(results.length).toBe(6);

        // Verify each detection has required properties
        results.forEach(result => {
            expect(result).toHaveProperty('word');
            expect(result).toHaveProperty('startIndex');
            expect(result).toHaveProperty('endIndex');
            expect(result.device).toBe('alliteration');
            expect(result.category).toBe('sound');
            expect(result.metadata).toHaveProperty('sound');
            expect(result.metadata).toHaveProperty('count');
            expect(result.metadata.count).toBeGreaterThanOrEqual(3);
        });
    });
});
