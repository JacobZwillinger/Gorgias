# Gorgias Test Suite

Comprehensive testing for rhetorical device detectors with multiple testing approaches.

## Testing Options

### 1. Browser-Based Visual Tests (Recommended for Development)

**File:** `test.html`

**How to run:**
1. Open `test.html` in your browser
2. Click "RUN ALL TESTS"
3. View results visually with pass/fail indicators

**Features:**
- ✅ No dependencies required
- ✅ Visual feedback with styled results
- ✅ Easy to debug
- ✅ See test inputs and expected vs actual outputs
- ✅ Test statistics (pass/fail/total)

**Best for:** Quick iteration, debugging, visual verification

---

### 2. Jest Unit Tests (For CI/CD and Automation)

**File:** `test/detectors.test.js`

**Setup:**
```bash
npm install
```

**Run tests:**
```bash
# Run all tests
npm test

# Run in watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

**Features:**
- ✅ Industry-standard testing framework
- ✅ Detailed assertions
- ✅ Coverage reports
- ✅ CI/CD integration
- ✅ Watch mode for TDD

**Best for:** Automated testing, CI/CD pipelines, coverage tracking

---

## Test Coverage

### Detector-Specific Tests

Each detector has dedicated tests:

1. **Anaphora**
   - Basic detection (consecutive sentences starting with same words)
   - Multi-word repetition
   - No false positives
   - Edge cases (empty, single sentence)

2. **Alliteration**
   - Basic detection (Peter Piper)
   - Adjacent word alliteration
   - Ignores articles (the, a, an)
   - No false positives

3. **Rhetorical Questions**
   - Single question detection
   - Multiple questions
   - No false positives on statements
   - Question mark validation

4. **Tricolon**
   - Classic three-part lists
   - Lists with "and" conjunction
   - No false positives on pairs
   - Semicolon-separated clauses

5. **Epizeuxis**
   - Immediate word repetition
   - With/without punctuation
   - Ignores short words
   - No false positives

### Integration Tests

- **Full analysis**: Tests complete `analyzeText()` function
- **Data structure validation**: Ensures correct output format
- **Category grouping**: Verifies markers are grouped by category
- **Empty text handling**
- **Very long text handling**
- **Special characters**

### Edge Case Tests

- Empty text
- Single word
- Very long text (1000+ sentences)
- Only punctuation
- Only numbers
- Special characters (#, @, !, ?)
- Mixed languages
- Newlines and tabs

---

## Test Statistics

Current test count: **30+ tests**

Coverage areas:
- ✅ Each detector (5 detectors × 4-5 tests each)
- ✅ Integration tests (5 tests)
- ✅ Edge cases (7 tests)
- ✅ False positive prevention
- ✅ Real-world samples (Gettysburg, Declaration, etc.)

---

## Adding New Tests

### Browser Tests (test-suite.js)

```javascript
runner.addTest('DeviceName: Description', () => {
    const text = 'Your test text here';
    const results = detectYourDevice(text);
    const passed = /* your assertion */;
    return {
        passed: passed,
        message: passed ? 'Success message' : 'Failure message',
        input: text,
        expected: 'What you expect',
        actual: `What you got: ${results.length} matches`
    };
});
```

### Jest Tests (detectors.test.js)

```javascript
describe('Your Device Detector', () => {
    test('describes what it tests', () => {
        const text = 'Your test text';
        const results = detectYourDevice(text);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].device).toBe('your_device');
    });
});
```

---

## Test-Driven Development Workflow

1. **Write test first** (it will fail)
2. **Implement detector** to make test pass
3. **Run tests** to verify
4. **Refactor** while keeping tests green
5. **Add edge case tests** as you discover issues

---

## Continuous Integration

For GitHub Actions or similar:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

---

## Future Test Enhancements

- [ ] Performance benchmarks
- [ ] Fuzzing tests (random input generation)
- [ ] Regression tests (track bugs that were fixed)
- [ ] Sample speech validation (verify all known devices in famous speeches)
- [ ] Detector accuracy metrics (precision/recall)

---

## Troubleshooting

### Browser tests not loading?
- Make sure you're serving from a web server (not file://)
- Check browser console for ES6 module errors
- Verify all detector files exist in `/detectors/`

### Jest tests failing?
- Run `npm install` first
- Make sure you're using Node.js 14+
- Check that `package.json` has `"type": "module"`

### Import errors?
- Verify all exports use `export function`
- Check import paths are correct
- ES6 modules require file extensions (.js)

---

## Questions?

See the main README.md or check the implementation plan in `.claude/plans/`.
