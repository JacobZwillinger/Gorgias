// Load device definitions from JSON
let deviceDefinitions = {};

fetch('rhetoric-devices.json')
    .then(r => r.json())
    .then(data => {
        deviceDefinitions = data.devices.reduce((acc, device) => {
            acc[device.id] = device;
            return acc;
        }, {});
    })
    .catch(err => console.error('Failed to load device definitions:', err));

// Retrieve analysis results from sessionStorage
const analysisData = sessionStorage.getItem('analysisResult');

if (!analysisData) {
    // No results found, redirect back to home
    window.location.href = 'index.html';
} else {
    const result = JSON.parse(analysisData);
    renderResults(result);

    // Convert summary to markers format
    const markers = {};
    if (result.devices && result.devices.length > 0) {
        result.devices.forEach(device => {
            const category = device.category || 'other';
            if (!markers[category]) {
                markers[category] = {};
            }
            markers[category][device.device] = (markers[category][device.device] || 0) + 1;
        });
    }

    renderMarkers(markers);
}

function renderResults(result) {
    const container = document.getElementById('analyzedText');
    const originalText = result.text || result.originalText;
    const highlights = result.devices || result.highlights || [];

    if (highlights.length === 0) {
        container.textContent = originalText;
        return;
    }

    // Build HTML with highlights
    let html = '';
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
        // Add text before the highlight
        html += escapeHtml(originalText.substring(lastIndex, highlight.startIndex));

        // Add highlighted text with data attributes for click handling
        html += `<span class="highlight" data-word="${escapeHtml(highlight.word)}" data-device="${highlight.device}" data-index="${index}">${escapeHtml(highlight.word)}</span>`;

        lastIndex = highlight.endIndex;
    });

    // Add remaining text
    html += escapeHtml(originalText.substring(lastIndex));

    container.innerHTML = html;

    // Add click handlers to highlighted words
    document.querySelectorAll('.highlight').forEach(element => {
        element.addEventListener('click', () => {
            const word = element.dataset.word;
            const device = element.dataset.device;
            openModal(word, device);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderMarkers(markers) {
    const markersList = document.getElementById('markersList');

    if (!markers || Object.keys(markers).length === 0) {
        markersList.innerHTML = '<div class="no-markers">No devices found</div>';
        return;
    }

    // Category display names
    const categoryNames = {
        'repetition': 'Repetition Devices',
        'sound': 'Sound Devices',
        'structure': 'Structural Devices',
        'emphasis': 'Emphasis Devices',
        'other': 'Other Devices'
    };

    // Device display names (convert IDs to readable names)
    const deviceNames = {
        'anaphora': 'Anaphora',
        'epistrophe': 'Epistrophe',
        'epizeuxis': 'Epizeuxis',
        'alliteration': 'Alliteration',
        'rhetorical_question': 'Rhetorical Question',
        'tricolon': 'Tricolon',
        'diacope': 'Diacope',
        'anadiplosis': 'Anadiplosis',
        'symploce': 'Symploce',
        'polyptoton': 'Polyptoton',
        'assonance': 'Assonance',
        'consonance': 'Consonance',
        'sibilance': 'Sibilance',
        'onomatopoeia': 'Onomatopoeia',
        'parallelism': 'Parallelism',
        'isocolon': 'Isocolon',
        'polysyndeton': 'Polysyndeton',
        'asyndeton': 'Asyndeton',
        'exclamation': 'Exclamation',
        'ellipsis': 'Ellipsis'
    };

    // Render by category
    let html = '';

    for (const [category, devices] of Object.entries(markers)) {
        const categoryName = categoryNames[category] || category;
        const totalCount = Object.values(devices).reduce((a, b) => a + b, 0);

        html += `
            <div class="category-section">
                <div class="category-header" data-category="${category}">
                    <span class="category-name">${categoryName}</span>
                    <span class="category-count">${totalCount}</span>
                </div>
                <div class="category-devices" data-category="${category}">
        `;

        for (const [device, count] of Object.entries(devices)) {
            const deviceName = deviceNames[device] || device;
            html += `
                <div class="marker-item" data-device="${device}">
                    <span class="marker-name">${deviceName}</span>
                    <span class="marker-count">${count}</span>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    }

    markersList.innerHTML = html;

    // Add click handlers for expand/collapse categories
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.dataset.category;
            const devicesDiv = document.querySelector(`.category-devices[data-category="${category}"]`);
            devicesDiv.classList.toggle('expanded');
            header.classList.toggle('expanded');
        });
    });

    // Add click handlers to marker items to filter/highlight by device
    document.querySelectorAll('.marker-item').forEach(markerItem => {
        markerItem.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger category collapse
            const deviceType = markerItem.dataset.device;
            toggleDeviceHighlight(deviceType, markerItem);
        });
    });

    // Auto-expand first category
    const firstCategory = document.querySelector('.category-devices');
    if (firstCategory) {
        firstCategory.classList.add('expanded');
        const firstHeader = document.querySelector('.category-header');
        if (firstHeader) firstHeader.classList.add('expanded');
    }
}

// Track currently selected device
let selectedDevice = null;

function toggleDeviceHighlight(deviceType, markerElement) {
    const allHighlights = document.querySelectorAll('.highlight');
    const allMarkers = document.querySelectorAll('.marker-item');

    if (selectedDevice === deviceType) {
        // Clicking the same device - deselect
        selectedDevice = null;
        allHighlights.forEach(h => {
            h.classList.remove('filtered-out', 'device-anaphora', 'device-epistrophe', 'device-alliteration', 'device-tricolon', 'device-epizeuxis', 'device-rhetorical_question');
        });
        allMarkers.forEach(m => m.classList.remove('selected'));
    } else {
        // Selecting a new device
        selectedDevice = deviceType;

        // Remove all previous selections
        allMarkers.forEach(m => m.classList.remove('selected'));
        markerElement.classList.add('selected');

        // Filter highlights
        allHighlights.forEach(highlight => {
            const highlightDevice = highlight.dataset.device;

            if (highlightDevice === deviceType) {
                // This is the selected device - highlight it
                highlight.classList.remove('filtered-out');
                highlight.classList.add(`device-${deviceType}`);
            } else {
                // Different device - dim it
                highlight.classList.add('filtered-out');
                highlight.classList.remove(`device-${highlightDevice}`);
            }
        });
    }
}

function openModal(word, deviceType) {
    const modal = document.getElementById('markerModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Get device definition from loaded JSON
    const device = deviceDefinitions[deviceType];

    if (device) {
        modalTitle.textContent = device.name;
        modalBody.innerHTML = `
            <div class="device-definition">
                <p><strong>Definition:</strong> ${escapeHtml(device.definition)}</p>
            </div>
            <div class="device-example">
                <p><strong>Example:</strong></p>
                <blockquote>"${escapeHtml(device.example)}"</blockquote>
                ${device.exampleSource ? `<p class="example-source">— ${escapeHtml(device.exampleSource)}</p>` : ''}
            </div>
            <div class="device-occurrence">
                <p><strong>Found in this text:</strong></p>
                <p class="occurrence-text">"${escapeHtml(word)}"</p>
            </div>
        `;
    } else {
        // Fallback if definition not loaded yet
        const deviceName = deviceType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        modalTitle.textContent = deviceName;
        modalBody.innerHTML = `
            <div class="device-occurrence">
                <p><strong>Found in this text:</strong></p>
                <p class="occurrence-text">"${escapeHtml(word)}"</p>
            </div>
            <p><em>Loading device information...</em></p>
        `;
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('markerModal');
    modal.classList.remove('active');
}

// Set up modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('markerModal');
    const closeBtn = document.querySelector('.modal-close');

    // Close on X button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
