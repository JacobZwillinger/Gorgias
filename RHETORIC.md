# Rhetorical Devices Implementation Checklist

## Overview
This document tracks the implementation of pattern-based rhetorical device detectors for the Gorgias analyzer. Target: 20 devices across 4 categories.

---

## Repetition Devices (0/7)
- [ ] **Anaphora** - Repetition at the beginning of successive clauses
- [ ] **Epistrophe** - Repetition at the end of successive clauses
- [ ] **Epizeuxis** - Immediate word repetition ("Never, never, never")
- [ ] **Diacope** - Repetition with words between ("Bond, James Bond")
- [ ] **Anadiplosis** - End of clause → start of next clause
- [ ] **Symploce** - Anaphora + Epistrophe combined
- [ ] **Polyptoton** - Same root, different forms (dream/dreaming)

## Sound Devices (0/5)
- [ ] **Alliteration** - Same starting consonant sound
- [ ] **Assonance** - Vowel sound repetition
- [ ] **Consonance** - Consonant sound repetition (not at start)
- [ ] **Sibilance** - Repetition of 's' sounds
- [ ] **Onomatopoeia** - Words that sound like their meaning (buzz, hiss)

## Structural Devices (0/5)
- [ ] **Tricolon** - Three parallel elements
- [ ] **Parallelism** - Similar grammatical structures
- [ ] **Isocolon** - Parallel phrases of equal length
- [ ] **Polysyndeton** - Multiple conjunctions ("and...and...and")
- [ ] **Asyndeton** - Omitted conjunctions in lists

## Emphasis Devices (0/3)
- [ ] **Rhetorical Question** - Questions not expecting answers
- [ ] **Exclamation** - Emphatic statements with !
- [ ] **Ellipsis** - Trailing off with ...

---

## Progress Summary
- **Total Implemented:** 0/20 (0%)
- **Repetition:** 0/7
- **Sound:** 0/5
- **Structural:** 0/5
- **Emphasis:** 0/3

---

## Implementation Priority
1. ⭐ **High Priority** (Common in speeches): Anaphora, Epistrophe, Tricolon
2. **Medium Priority** (Easy to detect): Alliteration, Rhetorical Questions, Exclamation
3. **Lower Priority** (Complex patterns): Symploce, Polyptoton, Isocolon

---

## Notes
- Each device has a corresponding detector file in `/detectors/[device-name].js`
- All detectors follow the same pattern: accept text, return array of highlights
- Highlight format: `{word, startIndex, endIndex, device, category}`
- Test each detector with sample texts before marking as complete

---

## Testing Checklist
- [ ] Test on Gettysburg Address
- [ ] Test on "I Have a Dream" speech
- [ ] Test on Declaration of Independence
- [ ] Test on Churchill "We Shall Fight" speech
- [ ] Verify no false positives
- [ ] Verify modal displays correct definitions
- [ ] Verify category grouping works

---

Last Updated: 2026-01-20
