import { metaphone } from 'metaphone';

const text = 'Peter Piper picked a peck of pickled peppers.';
const words = ['Peter', 'Piper', 'picked', 'peck', 'pickled', 'peppers'];

console.log('Testing metaphone:');
words.forEach(word => {
  const phonetic = metaphone(word);
  console.log(`${word}: ${phonetic}`);
});

// Now test the actual detection
const FUNCTION_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 'for',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'it', 'its', 'that', 'this', 'these', 'those'
]);

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

console.log('\nFirst consonant sounds:');
words.forEach(word => {
  const sound = getFirstConsonantSound(word);
  console.log(`${word}: ${sound}`);
});
