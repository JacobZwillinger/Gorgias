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

// Device example texts (synthetic examples demonstrating specific devices)
const DEVICE_EXAMPLES = {
    // TIER 1
    alliteration: `Peter Piper picked a peck of pickled peppers perfectly. The brave bold boys battled bravely beyond belief. Phil's phonetic phrases favor fantastic philosophy. The knight knew nothing new about navigation. Garry's gregarious grandfather greatly enjoyed gorgeous green gardens. Clever cats carefully catch crafty crows and cunning crickets consistently. Cathy's kitchen clearly called for cleaning. Carl kicked the can carelessly. The queen's quick quips quieted the quarrel. Wild William's will was written in the winter. Magnificent May makes memories in Manchester. Sally sells seashells by the seashore. Round and round the rugged rocks the ragged rascal ran. Whisper words of wisdom while we wait. She sells Swiss sweets swiftly. The writer wrote the wrong words. An apple and an orange sat alone. Time flies like an arrow. A big bird sang. Silent letters make no sense. We can not dedicate, we can not consecrate, we can not hallow this ground. Government of the people, by the people, for the people, shall not perish from the earth. We will fight with growing confidence and growing strength in the air.`,

    assonance: `The rain in Spain stays mainly in the plain. How now brown cow. Fleet feet sweep by sleeping geese. We need to feel the real heat.`,

    consonance: `The lumpy, bumpy road led to the dusty, musty town. Pitter patter, the bitter batter splattered. Mike likes his new bike on the turnpike.`,

    anaphora: `We shall fight on the beaches. We shall fight on the landing grounds. We shall fight in the fields and in the streets. We shall fight in the hills. We shall never surrender.`,

    epistrophe: `When I was a child, I spoke as a child. I understood as a child. I thought as a child. But when I became a man, I put away childish things as a man.`,

    epizeuxis: `Never, never, never give up. The horror! The horror! Forward, forward, forward to victory!`,

    anadiplosis: `Fear leads to anger. Anger leads to hate. Hate leads to suffering. Suffering leads to the dark side.`,

    isocolon: `Veni, vidi, vici. I came, I saw, I conquered. Easy come, easy go. Read, write, revise.`,

    tricolon: `Government of the people, by the people, for the people shall not perish. Truth, justice, and the American way. Friends, Romans, countrymen, lend me your ears.`,

    antithesis: `One small step for man, one giant leap for mankind. Not that I loved Caesar less, but that I loved Rome more. To be or not to be, that is the question.`,

    chiasmus: `Ask not what your country can do for you—ask what you can do for your country. Never let a fool kiss you or a kiss fool you. Fair is foul, and foul is fair.`,

    'rhetorical-question': `Is the Pope Catholic? Does a bear sleep in the woods? Who can endure such injustice? What sane person would approve of this madness?`,

    // TIER 2
    polyptoton: `Judge not, lest ye be judged. Let me live my life as I let you live yours. The strong strengthen the strength of the nation. Love the one you love with all your heart.`,

    antimetabole: `Fair is foul, and foul is fair. All for one and one for all. You can take the boy out of the country, but you can't take the country out of the boy.`,

    symploce: `When there is talk of hatred, let us stand up and talk against it. When there is talk of violence, let us stand up and talk against it. When there is talk of war, let us stand up and talk against it.`,

    asyndeton: `I came, I saw, I conquered. We shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe. Blood, sweat, tears, toil.`,

    polysyndeton: `We have ships and men and money and stores. The water was cold and clear and blue and beautiful. Let the whitefolks have their money and power and segregation and sarcasm.`,

    // TIER 3
    paradox: `Less is more. The child is father to the man. I must be cruel to be kind. This is the beginning of the end. War is peace. Freedom is slavery.`,

    oxymoron: `Deafening silence filled the room. That was awfully good. A bitter-sweet memory. The living dead walked among us. Jumbo shrimp arrived on small plates.`,

    irony: `What a beautiful day this is! (said during a hurricane). Oh great, another meeting—just what I needed. How wonderful that the project failed right before launch.`,

    antanaclasis: `If we don't hang together, we'll hang separately. Your argument doesn't hold water, but that bucket does. Time flies like an arrow; fruit flies like a banana.`
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const sampleBtns = document.querySelectorAll('.sample-btn');
    const deviceExample = document.getElementById('deviceExample');

    // Sample button handlers
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sample = btn.getAttribute('data-sample');
            if (SAMPLE_TEXTS[sample]) {
                textInput.value = SAMPLE_TEXTS[sample];
            }
        });
    });

    // Device example dropdown handler
    deviceExample.addEventListener('change', () => {
        const device = deviceExample.value;
        if (device && DEVICE_EXAMPLES[device]) {
            textInput.value = DEVICE_EXAMPLES[device];
        }
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
