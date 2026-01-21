// Vercel Serverless Function for Rhetorical Analysis
// Caches the 4 sample texts to avoid API calls

import Anthropic from '@anthropic-ai/sdk';

// Pre-cached results for sample texts (to avoid API costs)
const CACHED_RESULTS = {
  declaration: {
    "highlights": [
      {"word": "We hold", "startIndex": 0, "endIndex": 7, "device": "anaphora", "category": "repetition"},
      {"word": "that all men", "startIndex": 35, "endIndex": 47, "device": "parallelism", "category": "structure"},
      {"word": "that they are", "startIndex": 71, "endIndex": 84, "device": "parallelism", "category": "structure"},
      {"word": "Life, Liberty, and the pursuit of Happiness", "startIndex": 153, "endIndex": 197, "device": "tricolon", "category": "structure"},
      {"word": "That", "startIndex": 199, "endIndex": 203, "device": "anaphora", "category": "repetition"},
      {"word": "That", "startIndex": 256, "endIndex": 260, "device": "anaphora", "category": "repetition"}
    ]
  },
  gettysburg: {
    "highlights": [
      {"word": "We are met", "startIndex": 0, "endIndex": 10, "device": "anaphora", "category": "repetition"},
      {"word": "We have come", "startIndex": 42, "endIndex": 54, "device": "anaphora", "category": "repetition"},
      {"word": "we can not dedicate, we can not consecrate, we can not hallow", "startIndex": 185, "endIndex": 247, "device": "anaphora", "category": "repetition"},
      {"word": "of the people, by the people, for the people", "startIndex": 271, "endIndex": 316, "device": "tricolon", "category": "structure"}
    ]
  },
  dream: {
    "highlights": [
      {"word": "I have a dream", "startIndex": 0, "endIndex": 14, "device": "anaphora", "category": "repetition"},
      {"word": "I have a dream", "startIndex": 54, "endIndex": 68, "device": "anaphora", "category": "repetition"},
      {"word": "I have a dream", "startIndex": 209, "endIndex": 223, "device": "anaphora", "category": "repetition"},
      {"word": "I have a dream", "startIndex": 349, "endIndex": 363, "device": "anaphora", "category": "repetition"}
    ]
  },
  churchill: {
    "highlights": [
      {"word": "We shall fight", "startIndex": 0, "endIndex": 14, "device": "anaphora", "category": "repetition"},
      {"word": "We shall fight", "startIndex": 31, "endIndex": 45, "device": "anaphora", "category": "repetition"},
      {"word": "We shall fight", "startIndex": 70, "endIndex": 84, "device": "anaphora", "category": "repetition"},
      {"word": "We shall fight", "startIndex": 119, "endIndex": 133, "device": "anaphora", "category": "repetition"},
      {"word": "We shall never", "startIndex": 148, "endIndex": 162, "device": "anaphora", "category": "repetition"},
      {"word": "We will defend", "startIndex": 173, "endIndex": 187, "device": "anaphora", "category": "repetition"}
    ]
  }
};

// Helper to build markers from highlights
function buildMarkersSummary(highlights) {
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

// Check if text matches a cached sample
function getCachedResult(text) {
  const normalized = text.trim().substring(0, 100);

  // Check each cached sample
  for (const [key, result] of Object.entries(CACHED_RESULTS)) {
    // Get the sample text from the predefined list
    const sampleTexts = {
      declaration: `We hold these truths to be self-evident`,
      gettysburg: `We are met on a great battlefield`,
      dream: `I have a dream that one day this nation`,
      churchill: `We shall fight on the beaches`
    };

    if (normalized.startsWith(sampleTexts[key])) {
      return result;
    }
  }

  return null;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if this is a cached sample
    const cached = getCachedResult(text);
    if (cached) {
      console.log('Returning cached result');
      return res.status(200).json({
        originalText: text,
        highlights: cached.highlights,
        markers: buildMarkersSummary(cached.highlights),
        cached: true
      });
    }

    // For non-cached texts, check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        error: 'API key not configured. Please use one of the sample texts.',
        cached: false
      });
    }

    // Call Claude API for non-cached texts
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: `Analyze this text for rhetorical devices and return ONLY a JSON object with this exact structure:

{
  "highlights": [
    {
      "word": "exact text from the original",
      "startIndex": <number>,
      "endIndex": <number>,
      "device": "device_name",
      "category": "category_name"
    }
  ]
}

Categories must be: "repetition", "sound", "structure", or "emphasis"
Devices to detect: anaphora, epistrophe, epizeuxis, alliteration, tricolon, parallelism, rhetorical_question

Text to analyze:
"""
${text}
"""

Return ONLY valid JSON, no other text.`
      }]
    });

    const content = message.content[0].text;
    const parsed = JSON.parse(content);

    return res.status(200).json({
      originalText: text,
      highlights: parsed.highlights || [],
      markers: buildMarkersSummary(parsed.highlights || []),
      cached: false
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
}
