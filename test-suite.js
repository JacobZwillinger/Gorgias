// Comprehensive Test Suite for Gorgias Rhetorical Device Detectors

import { detectAnaphora } from './detectors/anaphora.js';
import { detectAlliteration } from './detectors/alliteration.js';
import { detectRhetoricalQuestion } from './detectors/rhetorical-question.js';
import { detectTricolon } from './detectors/tricolon.js';
import { detectEpizeuxis } from './detectors/epizeuxis.js';
import { analyzeText } from './mock-api.js';

// Test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = { pass: 0, fail: 0, total: 0 };
    }

    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runAll() {
        this.results = { pass: 0, fail: 0, total: 0 };
        const resultsDiv = document.getElementById('testResults');
        resultsDiv.innerHTML = '';

        for (const test of this.tests) {
            const result = await this.runTest(test);
            this.results.total++;
            if (result.passed) {
                this.results.pass++;
            } else {
                this.results.fail++;
            }
            this.renderTestResult(result, resultsDiv);
        }

        this.updateStats();
    }

    async runTest(test) {
        try {
            const result = await test.testFn();
            return {
                name: test.name,
                passed: result.passed,
                message: result.message,
                input: result.input,
                expected: result.expected,
                actual: result.actual
            };
        } catch (error) {
            return {
                name: test.name,
                passed: false,
                message: `Error: ${error.message}`,
                input: '',
                expected: '',
                actual: ''
            };
        }
    }

    renderTestResult(result, container) {
        const section = result.name.split(':')[0];
        let sectionDiv = container.querySelector(`[data-section="${section}"]`);

        if (!sectionDiv) {
            sectionDiv = document.createElement('div');
            sectionDiv.className = 'test-section';
            sectionDiv.setAttribute('data-section', section);
            sectionDiv.innerHTML = `<h2>${section}</h2>`;
            container.appendChild(sectionDiv);
        }

        const testDiv = document.createElement('div');
        testDiv.className = `test-case ${result.passed ? 'pass' : 'fail'}`;
        testDiv.innerHTML = `
            <div class="test-name">${result.name}</div>
            ${result.input ? `<div class="test-input">Input: "${result.input}"</div>` : ''}
            ${result.expected ? `<div class="test-expected">Expected: ${result.expected}</div>` : ''}
            ${result.actual ? `<div class="test-expected">Actual: ${result.actual}</div>` : ''}
            <div class="test-result ${result.passed ? 'pass' : 'fail'}">
                ${result.passed ? '✓ PASS' : '✗ FAIL'} - ${result.message}
            </div>
        `;
        sectionDiv.appendChild(testDiv);
    }

    updateStats() {
        document.getElementById('testStats').style.display = 'flex';
        document.getElementById('passCount').textContent = this.results.pass;
        document.getElementById('failCount').textContent = this.results.fail;
        document.getElementById('totalCount').textContent = this.results.total;
    }
}

const runner = new TestRunner();

// ========================================
// ANAPHORA TESTS
// ========================================

runner.addTest('Anaphora: Basic detection', () => {
    const text = 'We shall fight on the beaches. We shall fight on the landing grounds. We shall fight in the fields.';
    const results = detectAnaphora(text);
    const found = results.filter(r => r.device === 'anaphora').length > 0;
    return {
        passed: found,
        message: found ? 'Detected anaphora correctly' : 'Failed to detect anaphora',
        input: text,
        expected: 'At least one anaphora match',
        actual: `Found ${results.length} matches`
    };
});

runner.addTest('Anaphora: No false positive', () => {
    const text = 'The cat sat on the mat. A dog ran in the park. Some birds flew overhead.';
    const results = detectAnaphora(text);
    const found = results.length === 0;
    return {
        passed: found,
        message: found ? 'No false positives' : 'Incorrectly detected anaphora',
        input: text,
        expected: '0 matches',
        actual: `Found ${results.length} matches`
    };
});

runner.addTest('Anaphora: Multi-word repetition', () => {
    const text = 'I have a dream that one day. I have a dream that my children.';
    const results = detectAnaphora(text);
    const found = results.some(r => r.word.toLowerCase().includes('i have'));
    return {
        passed: found,
        message: found ? 'Detected multi-word anaphora' : 'Failed to detect multi-word anaphora',
        input: text,
        expected: 'Match containing "I have"',
        actual: results.length > 0 ? `Found "${results[0].word}"` : 'No matches'
    };
});

// ========================================
// ALLITERATION TESTS
// ========================================

runner.addTest('Alliteration: Basic detection', () => {
    const text = 'Peter Piper picked a peck of pickled peppers.';
    const results = detectAlliteration(text);
    const found = results.length >= 3; // Should find at least 3 'p' words
    return {
        passed: found,
        message: found ? 'Detected alliteration' : 'Failed to detect alliteration',
        input: text,
        expected: 'At least 3 matches',
        actual: `Found ${results.length} matches`
    };
});

runner.addTest('Alliteration: No false positive on articles', () => {
    const text = 'The cat and the dog and the bird.';
    const results = detectAlliteration(text);
    // Should not flag "the" repeatedly as alliteration
    const hasThe = results.some(r => r.word.toLowerCase() === 'the');
    return {
        passed: !hasThe,
        message: !hasThe ? 'Correctly ignores articles' : 'Incorrectly flagged articles',
        input: text,
        expected: 'No "the" flagged',
        actual: hasThe ? 'Flagged "the"' : 'No articles flagged'
    };
});

runner.addTest('Alliteration: Adjacent words', () => {
    const text = 'Big bad bear broke the branch.';
    const results = detectAlliteration(text);
    const found = results.some(r => r.device === 'alliteration');
    return {
        passed: found,
        message: found ? 'Detected alliteration in adjacent words' : 'Missed alliteration',
        input: text,
        expected: 'Find "b" alliteration',
        actual: `Found ${results.length} matches`
    };
});

// ========================================
// RHETORICAL QUESTION TESTS
// ========================================

runner.addTest('Rhetorical Question: Basic detection', () => {
    const text = 'Who controls the past controls the future. Who controls the present controls the past?';
    const results = detectRhetoricalQuestion(text);
    const found = results.length > 0;
    return {
        passed: found,
        message: found ? 'Detected rhetorical question' : 'Failed to detect question',
        input: text,
        expected: '1 question',
        actual: `Found ${results.length} questions`
    };
});

runner.addTest('Rhetorical Question: No questions', () => {
    const text = 'This is a statement. This is another statement.';
    const results = detectRhetoricalQuestion(text);
    const found = results.length === 0;
    return {
        passed: found,
        message: found ? 'No false positives' : 'Detected questions where none exist',
        input: text,
        expected: '0 questions',
        actual: `Found ${results.length} questions`
    };
});

runner.addTest('Rhetorical Question: Multiple questions', () => {
    const text = 'Can we do this? Will we succeed? Should we try?';
    const results = detectRhetoricalQuestion(text);
    const found = results.length === 3;
    return {
        passed: found,
        message: found ? 'Found all 3 questions' : 'Incorrect count',
        input: text,
        expected: '3 questions',
        actual: `Found ${results.length} questions`
    };
});

// ========================================
// TRICOLON TESTS
// ========================================

runner.addTest('Tricolon: Basic three-part list', () => {
    const text = 'I came, I saw, I conquered.';
    const results = detectTricolon(text);
    const found = results.length > 0;
    return {
        passed: found,
        message: found ? 'Detected tricolon' : 'Failed to detect tricolon',
        input: text,
        expected: '1 tricolon',
        actual: `Found ${results.length} tricolons`
    };
});

runner.addTest('Tricolon: With "and" conjunction', () => {
    const text = 'Government of the people, by the people, and for the people.';
    const results = detectTricolon(text);
    const found = results.length > 0;
    return {
        passed: found,
        message: found ? 'Detected tricolon with "and"' : 'Failed to detect',
        input: text,
        expected: '1 tricolon',
        actual: `Found ${results.length} tricolons`
    };
});

runner.addTest('Tricolon: No false positive on pair', () => {
    const text = 'First item, second item.';
    const results = detectTricolon(text);
    const found = results.length === 0;
    return {
        passed: found,
        message: found ? 'No false positive' : 'Incorrectly flagged as tricolon',
        input: text,
        expected: '0 tricolons',
        actual: `Found ${results.length} tricolons`
    };
});

// ========================================
// EPIZEUXIS TESTS
// ========================================

runner.addTest('Epizeuxis: Immediate repetition', () => {
    const text = 'Never, never, never give up.';
    const results = detectEpizeuxis(text);
    const found = results.length > 0;
    return {
        passed: found,
        message: found ? 'Detected epizeuxis' : 'Failed to detect',
        input: text,
        expected: 'At least 1 repetition',
        actual: `Found ${results.length} repetitions`
    };
});

runner.addTest('Epizeuxis: No false positive', () => {
    const text = 'The cat is big. The dog is small.';
    const results = detectEpizeuxis(text);
    const found = results.length === 0;
    return {
        passed: found,
        message: found ? 'No false positives' : 'Incorrectly detected repetition',
        input: text,
        expected: '0 repetitions',
        actual: `Found ${results.length} repetitions`
    };
});

// ========================================
// INTEGRATION TESTS
// ========================================

runner.addTest('Integration: Full analysis on Gettysburg Address', () => {
    const text = 'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.';
    const result = analyzeText(text);
    const hasHighlights = result.highlights.length > 0;
    const hasMarkers = Object.keys(result.markers).length > 0;
    return {
        passed: hasHighlights && hasMarkers,
        message: hasHighlights && hasMarkers ? 'Full analysis working' : 'Analysis incomplete',
        input: text.substring(0, 80) + '...',
        expected: 'Highlights and markers present',
        actual: `${result.highlights.length} highlights, ${Object.keys(result.markers).length} categories`
    };
});

runner.addTest('Integration: Empty text', () => {
    const text = '';
    const result = analyzeText(text);
    const correct = result.highlights.length === 0 && Object.keys(result.markers).length === 0;
    return {
        passed: correct,
        message: correct ? 'Handles empty text correctly' : 'Error with empty text',
        input: '(empty string)',
        expected: 'No highlights or markers',
        actual: `${result.highlights.length} highlights, ${Object.keys(result.markers).length} categories`
    };
});

runner.addTest('Integration: Very short text', () => {
    const text = 'Hello.';
    const result = analyzeText(text);
    const noErrors = result !== null && result.originalText === text;
    return {
        passed: noErrors,
        message: noErrors ? 'Handles short text' : 'Error with short text',
        input: text,
        expected: 'No errors',
        actual: noErrors ? 'Success' : 'Failed'
    };
});

runner.addTest('Integration: Special characters', () => {
    const text = 'What!? Can we #win @this? Yes, yes, yes!';
    const result = analyzeText(text);
    const noErrors = result !== null;
    return {
        passed: noErrors,
        message: noErrors ? 'Handles special characters' : 'Error with special chars',
        input: text,
        expected: 'No errors',
        actual: noErrors ? 'Success' : 'Failed'
    };
});

// ========================================
// EDGE CASES
// ========================================

runner.addTest('Edge Case: Very long text', () => {
    const text = 'This is a sentence. '.repeat(100);
    const result = analyzeText(text);
    const noErrors = result !== null;
    return {
        passed: noErrors,
        message: noErrors ? 'Handles long text' : 'Error with long text',
        input: '(100 repeated sentences)',
        expected: 'No errors',
        actual: noErrors ? 'Success' : 'Failed'
    };
});

runner.addTest('Edge Case: Only punctuation', () => {
    const text = '!?.,;:';
    const result = analyzeText(text);
    const correct = result.highlights.length === 0;
    return {
        passed: correct,
        message: correct ? 'Handles punctuation-only text' : 'Error with punctuation',
        input: text,
        expected: 'No highlights',
        actual: `${result.highlights.length} highlights`
    };
});

runner.addTest('Edge Case: Numbers only', () => {
    const text = '123 456 789';
    const result = analyzeText(text);
    const correct = result.highlights.length === 0;
    return {
        passed: correct,
        message: correct ? 'Handles numbers correctly' : 'Error with numbers',
        input: text,
        expected: 'No highlights',
        actual: `${result.highlights.length} highlights`
    };
});

// ========================================
// DOM / BROWSER TESTS
// ========================================

runner.addTest('DOM: app.js buttons should be wrapped in DOMContentLoaded', async () => {
    try {
        const response = await fetch('app.js');
        const code = await response.text();
        const hasDOMReady = code.includes('DOMContentLoaded');
        return {
            passed: hasDOMReady,
            message: hasDOMReady ? 'DOMContentLoaded wrapper found' : 'Missing DOMContentLoaded wrapper',
            input: 'app.js source code',
            expected: 'Contains DOMContentLoaded event listener',
            actual: hasDOMReady ? 'Found' : 'Not found'
        };
    } catch (err) {
        return {
            passed: false,
            message: 'Could not fetch app.js',
            input: '',
            expected: '',
            actual: err.message
        };
    }
});

// Make runAllTests global so it can be called from HTML
window.runAllTests = () => {
    runner.runAll();
};
