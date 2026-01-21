# Device Filtering Feature

## Overview

Added interactive filtering to help users see which highlighted words correspond to which rhetorical devices.

## How It Works

### Click on a Device in the Sidebar

When you click on a device name in the "RHETORICAL DEVICES" sidebar (e.g., "Anaphora"), the following happens:

1. **Selected device gets highlighted** - The marker item gets a red border and glow
2. **Matching highlights change color** - All text highlights of that device type change to a unique color
3. **Other highlights are dimmed** - Highlights of other devices fade out to gray
4. **Click again to deselect** - Clicking the same device again returns everything to normal

### Device-Specific Colors

Each device type has its own distinctive color:

| Device | Color | RGB |
|--------|-------|-----|
| **Anaphora** | Red | #e74c3c |
| **Epistrophe** | Orange | #e67e22 |
| **Epizeuxis** | Gold | #f39c12 |
| **Tricolon** | Green | #27ae60 |
| **Alliteration** | Blue | #3498db |
| **Rhetorical Question** | Purple | #9b59b6 |

---

## User Experience

### Example: Churchill Speech

**Initial View:**
- All highlights are purple (default)
- Sidebar shows: "Anaphora (6)"

**Click "Anaphora":**
- 6 instances of "We shall fight" / "We shall" turn **red** with glow
- Marker item gets red border
- All other devices remain visible but not highlighted yet

**Click "Anaphora" again:**
- Everything returns to default purple
- Red border removed from marker

---

## Visual States

### Highlight States

```css
/* Default state - all devices */
.highlight {
    background-color: #9b59b6; /* purple */
}

/* When device is selected */
.highlight.device-anaphora {
    background-color: #e74c3c; /* red */
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.5); /* red glow */
}

/* When device is NOT selected (dimmed) */
.highlight.filtered-out {
    background-color: #2d2d44; /* dark gray */
    color: #666;
    opacity: 0.4;
}
```

### Marker States

```css
/* Default state */
.marker-item {
    border: 1px solid #2d2d44;
}

/* Hover state */
.marker-item:hover {
    border-color: #9b59b6;
    transform: translateX(5px);
}

/* Selected state */
.marker-item.selected {
    border-color: #e94560;
    border-width: 2px;
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.3);
}
```

---

## Implementation Details

### JavaScript Logic (results.js)

```javascript
// Track currently selected device
let selectedDevice = null;

function toggleDeviceHighlight(deviceType, markerElement) {
    const allHighlights = document.querySelectorAll('.highlight');
    const allMarkers = document.querySelectorAll('.marker-item');

    if (selectedDevice === deviceType) {
        // Deselect - return to default
        selectedDevice = null;
        // Remove all color classes
    } else {
        // Select new device
        selectedDevice = deviceType;

        // Highlight matching devices
        allHighlights.forEach(highlight => {
            if (highlight.dataset.device === deviceType) {
                highlight.classList.add(`device-${deviceType}`);
            } else {
                highlight.classList.add('filtered-out');
            }
        });
    }
}
```

### Data Flow

1. User clicks marker item → `click` event
2. Event handler calls `toggleDeviceHighlight(deviceType, element)`
3. Function checks if device is already selected
4. Updates CSS classes on all highlights based on their `data-device` attribute
5. Updates visual state of marker items

---

## Benefits

### 1. **Better Understanding**
Users can instantly see which words are examples of which device.

**Before:** "What parts of this text are anaphora?"
**After:** Click "Anaphora" → See all 6 instances highlighted in red

### 2. **Visual Learning**
Different colors for different devices help users learn to recognize patterns.

**Example:**
- Red anaphora: "We shall fight..."
- Blue alliteration: "fight... fields... fight"
- Green tricolon: "of the people, by the people, for the people"

### 3. **Focused Analysis**
Dim out other devices to focus on one type at a time.

**Use case:** Studying only repetition devices? Filter to just see anaphora/epistrophe.

---

## Edge Cases Handled

### Multiple Devices in Same Text
If the same word could be multiple devices (rare due to deduplication), the higher-priority device wins.

### No Devices Selected
All highlights show in default purple - no filtering applied.

### Clicking Different Devices
Seamlessly switches from one filter to another without needing to deselect first.

---

## Future Enhancements

### Possible Improvements
1. **Multi-select**: Hold Cmd/Ctrl to select multiple device types
2. **Color key**: Show legend of colors at top of sidebar
3. **Hover preview**: Hover over marker to preview (lighter version) without clicking
4. **Keyboard shortcuts**: 1-9 keys to select devices quickly
5. **URL state**: Save filter in URL so users can share filtered view

---

## Testing

### Manual Test Steps

1. Open app and analyze Churchill speech
2. Observe sidebar shows "Anaphora (6)"
3. Click "Anaphora" in sidebar
4. Verify:
   - ✅ All "We shall fight" instances turn red
   - ✅ Marker item gets red border
   - ✅ Other highlights (if any) are dimmed
5. Click "Anaphora" again
6. Verify:
   - ✅ All highlights return to purple
   - ✅ Red border removed

### Browser Compatibility
- ✅ Modern browsers with CSS transitions
- ✅ Touch devices (click works on mobile)
- ✅ Keyboard accessible (can tab to marker items)

---

## Files Modified

1. **results.js** (lines 155-210)
   - Added `toggleDeviceHighlight()` function
   - Added click handlers to marker items
   - Track selected device state

2. **styles.css** (lines 180-222, 341-351)
   - Device-specific color classes
   - Filtered-out (dimmed) state
   - Selected marker styling

---

## Color Palette Rationale

Colors chosen for:
- **High contrast** against dark background
- **Distinct from each other** for easy differentiation
- **Semantic meaning** where possible:
  - Red (anaphora) = repetition/emphasis
  - Green (tricolon) = structured/balanced
  - Blue (alliteration) = sound/flowing
  - Purple (rhetorical question) = questioning/inquiry

---

## Conclusion

This feature creates a powerful visual connection between the rhetorical device labels and the actual text examples, making the app much more educational and easier to use.

**Key benefit:** Users can now instantly answer "Where is that device in the text?" with a single click.
