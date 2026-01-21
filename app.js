// Import the analyzeText function from mock-api
import { analyzeText } from './mock-api.js';

// Sample documents - placeholder text
// Replace these with actual historical speech excerpts
const SAMPLE_TEXTS = {
    declaration: `We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty, and the pursuit of Happiness. That to secure these rights, Governments are instituted among Men. That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it.`,

    gettysburg: `We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. But, in a larger sense, we can not dedicate, we can not consecrate, we can not hallow this ground. Government of the people, by the people, for the people, shall not perish from the earth.`,

    dream: `I have a dream that one day this nation will rise up. I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood. I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today.`,

    churchill: `We shall fight on the beaches. We shall fight on the landing grounds. We shall fight in the fields and in the streets. We shall fight in the hills. We shall never surrender. We will defend our island, whatever the cost may be. We will fight with growing confidence and growing strength in the air.`
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    // Sample button handlers
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sample = btn.getAttribute('data-sample');
            if (SAMPLE_TEXTS[sample]) {
                textInput.value = SAMPLE_TEXTS[sample];
            }
        });
    });

    // Analyze button handler
    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();

        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'ANALYZING...';

        try {
            // Try API call first (works on Vercel)
            let result;
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });

                if (response.ok) {
                    result = await response.json();
                } else {
                    throw new Error('API unavailable');
                }
            } catch (apiError) {
                // Fallback to local analysis
                console.log('Using local analysis fallback');
                result = analyzeText(text);
            }

            // Store in sessionStorage
            sessionStorage.setItem('analysisResult', JSON.stringify(result));

            // Navigate to results page
            window.location.href = 'results.html';

        } catch (error) {
            console.error('Analysis error:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'ANALYZE';
        }
    });
});
