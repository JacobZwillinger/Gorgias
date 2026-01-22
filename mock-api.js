// Rhetorical Device Analyzer - Pattern-Based Detection
// Uses modular detectors to identify rhetorical devices in text

import { detectAlliteration } from './detectors/alliteration.js';

// Array of all detector functions
const DETECTORS = [
    detectAlliteration
];

export function analyzeText(text) {
    const highlights = [];

    // Run all detectors
    for (const detector of DETECTORS) {
        try {
            const results = detector(text);
            highlights.push(...results);
        } catch (error) {
            console.error(`Detector error:`, error);
        }
    }

    // Sort highlights by start index
    highlights.sort((a, b) => a.startIndex - b.startIndex);

    // Remove overlapping highlights (keep the longest/most specific one)
    const deduplicatedHighlights = deduplicateHighlights(highlights);

    // Build markers grouped by category and device
    const markers = buildMarkersSummary(deduplicatedHighlights);

    return {
        originalText: text,
        highlights: deduplicatedHighlights,
        markers: markers
    };
}

function deduplicateHighlights(highlights) {
    // Remove overlapping highlights with smart prioritization
    // Priority: anaphora/epistrophe > tricolon > alliteration
    const devicePriority = {
        'anaphora': 10,
        'epistrophe': 10,
        'epizeuxis': 9,
        'tricolon': 8,
        'rhetorical_question': 7,
        'alliteration': 5,
        'assonance': 5,
        'consonance': 5
    };

    const deduplicated = [];

    for (let i = 0; i < highlights.length; i++) {
        const current = highlights[i];
        let shouldAdd = true;

        // Check for overlaps with existing highlights
        for (let j = deduplicated.length - 1; j >= 0; j--) {
            const existing = deduplicated[j];
            const overlaps = (
                current.startIndex < existing.endIndex &&
                existing.startIndex < current.endIndex
            );

            if (overlaps) {
                const currentPriority = devicePriority[current.device] || 1;
                const existingPriority = devicePriority[existing.device] || 1;

                if (currentPriority > existingPriority) {
                    // Current has higher priority, replace existing
                    deduplicated.splice(j, 1);
                } else if (currentPriority === existingPriority) {
                    // Same priority, keep shorter/more specific one
                    const currentLength = current.endIndex - current.startIndex;
                    const existingLength = existing.endIndex - existing.startIndex;

                    if (currentLength < existingLength) {
                        // Current is shorter (more specific), replace existing
                        deduplicated.splice(j, 1);
                    } else {
                        // Existing is better, don't add current
                        shouldAdd = false;
                        break;
                    }
                } else {
                    // Existing has higher priority, don't add current
                    shouldAdd = false;
                    break;
                }
            }
        }

        if (shouldAdd) {
            deduplicated.push(current);
        }
    }

    // Re-sort by start index
    deduplicated.sort((a, b) => a.startIndex - b.startIndex);
    return deduplicated;
}

function buildMarkersSummary(highlights) {
    // Group by category, then by device name
    const categorized = {};

    highlights.forEach(h => {
        const category = h.category || 'other';
        const device = h.device;

        if (!categorized[category]) {
            categorized[category] = {};
        }
        if (!categorized[category][device]) {
            categorized[category][device] = 0;
        }
        categorized[category][device]++;
    });

    return categorized;
}
