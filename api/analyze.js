// API endpoint for analyzing text and detecting rhetorical devices
import { detectAlliteration } from '../detectors/alliteration.js';

/**
 * Main analysis function that runs all active detectors
 */
export function analyzeText(text) {
    if (!text || typeof text !== 'string') {
        return { devices: [], text: '' };
    }

    const devices = [];

    // Run alliteration detector
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
