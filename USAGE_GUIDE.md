# Gorgias - Usage Guide

## How to Use the Rhetorical Device Analyzer

### Step 1: Enter Text

**Option A - Use Sample Texts:**
1. Click one of the sample buttons:
   - "Declaration of Independence"
   - "Gettysburg Address"
   - "I Have a Dream"
   - "We Shall Fight"

**Option B - Enter Your Own:**
1. Type or paste your text into the textarea
2. Works best with speeches, persuasive writing, or literary texts

### Step 2: Analyze

1. Click the "ANALYZE" button
2. Wait briefly while the app detects rhetorical devices
3. Results page opens automatically

---

## Understanding the Results Page

### Main Text Area (Left)

Shows your analyzed text with **purple highlights** indicating rhetorical devices.

**What you can do:**
- **Click any highlight** → Opens modal with device definition and example
- **Hover over highlights** → They turn red and scale slightly

### Rhetorical Devices Panel (Right)

Shows all detected devices organized by category.

**Categories:**
- **Repetition Devices** - Anaphora, Epistrophe, Epizeuxis
- **Sound Devices** - Alliteration, Assonance, Consonance
- **Structural Devices** - Tricolon, Parallelism, Isocolon
- **Emphasis Devices** - Rhetorical Questions, Exclamations

**What you can do:**
- **Click category header** → Expand/collapse to show devices
- **Click device name** → Filter highlights by that device (see below)

---

## NEW: Device Filtering Feature

### How to Use It

**1. Click a device name in the sidebar**
   - Example: Click "Anaphora (6)"

**What happens:**
- ✅ All 6 anaphora instances turn **RED** and glow
- ✅ Marker item gets red border
- ✅ Other devices (if any) are dimmed out

**2. Click the same device again**
- ✅ Returns to default view (all purple)
- ✅ Red border removed

**3. Click a different device**
- ✅ Instantly switches filter to new device
- ✅ New color applied

### Device Colors

| Device | Color |
|--------|-------|
| Anaphora | 🔴 Red |
| Epistrophe | 🟠 Orange |
| Epizeuxis | 🟡 Gold |
| Tricolon | 🟢 Green |
| Alliteration | 🔵 Blue |
| Rhetorical Question | 🟣 Purple |

---

## Example Workflow

### Analyzing Churchill's "We Shall Fight" Speech

**1. Load the text:**
- Click "We Shall Fight" button

**2. Click ANALYZE:**
- Results show 6 anaphora instances

**3. Explore anaphora:**
- Click "Anaphora (6)" in sidebar
- See all 6 "We shall fight" / "We shall" instances turn red
- Notice the pattern of repetition

**4. Return to overview:**
- Click "Anaphora" again
- All highlights return to purple

**5. Learn more:**
- Click any red highlight
- Modal opens with:
  - Definition of Anaphora
  - Famous example (Churchill quote)
  - The specific text found

---

## Tips & Tricks

### Finding Specific Devices

**Want to see only tricolons?**
1. Click "Tricolon" in sidebar
2. Everything else dims out
3. Green highlights show three-part structures

### Understanding a Device

**Not sure what "Epizeuxis" means?**
1. Click any epizeuxis highlight in the text
2. Modal explains: "Immediate repetition of a word for emphasis"
3. Shows example: "Never, never, never give up"

### Comparing Speeches

**Which speech uses more anaphora?**
1. Analyze Churchill → Note anaphora count
2. Go back → Analyze MLK
3. Compare: Churchill (6) vs MLK (3)

---

## What the App Detects

### Currently Implemented (5 devices)

**✅ Anaphora** - Repetition at start of sentences
- Example: "We shall fight... We shall fight..."

**✅ Alliteration** - 3+ words with same starting sound
- Example: "Peter Piper picked"

**✅ Rhetorical Questions** - Questions for effect
- Example: "Who controls the past?"

**✅ Tricolon** - Three-part structures
- Example: "Life, Liberty, and the pursuit of Happiness"

**✅ Epizeuxis** - Immediate word repetition
- Example: "Never, never, never"

### Coming Soon (15 more devices)

- Epistrophe, Assonance, Consonance, Polysyndeton, Asyndeton, and more...

---

## Known Limitations

### Pattern-Based Detection

The app uses **pattern matching**, not AI, so:

**Works well for:**
- ✅ Clear repetition (anaphora, epizeuxis)
- ✅ Sound patterns (alliteration)
- ✅ Structural patterns (tricolon)

**Struggles with:**
- ⚠️ Context-dependent devices (metaphor, irony)
- ⚠️ Subtle patterns
- ⚠️ Complex clause structures

### Sample Text Quality

Detection accuracy depends on text having clear rhetorical patterns:
- **Best:** Famous speeches (Churchill, MLK, Lincoln)
- **Good:** Persuasive essays, literary texts
- **Limited:** Casual writing, technical documentation

---

## Troubleshooting

### "No devices found"

**Possible reasons:**
1. Text is too short (< 3 sentences)
2. Text lacks repetitive patterns
3. Text is plain/technical prose

**Solution:** Try a speech or persuasive text

### Highlights seem wrong

**Example:** Random words highlighted as alliteration

**What's happening:** Our alliteration requires 3+ words with same starting sound within 6 words. This is intentional to reduce false positives.

### Device count seems low

**Remember:** Pattern-based detection is conservative to avoid false positives. We prioritize **accuracy over quantity**.

---

## Keyboard Shortcuts

Currently none implemented. Feature request: Add keyboard shortcuts for filtering (1-9 keys).

---

## Browser Requirements

**Requires:**
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)
- ✅ JavaScript enabled
- ✅ ES6 module support
- ✅ Served via HTTP (not file://)

**Recommended:**
- Desktop browser for best experience
- Screen width > 768px (mobile works but sidebar stacks)

---

## Getting Help

**Issues or Questions?**
- Check `DETECTOR_EVALUATION.md` for accuracy details
- Check `FEATURE_DEVICE_FILTERING.md` for filtering explanation
- Check `TEST_README.md` for testing information

**Report Bugs:**
- Note which text you were analyzing
- Which device showed unexpected results
- Browser and OS version

---

## Educational Use

This tool is perfect for:

**Students:**
- Learn to recognize rhetorical devices
- Analyze famous speeches
- Prepare for AP English exams

**Teachers:**
- Demonstrate rhetorical analysis
- Show patterns in famous texts
- Create engaging lessons

**Writers:**
- Study effective techniques
- Improve persuasive writing
- Analyze your own work

---

## Advanced: Understanding the Colors

When you filter by device, colors are chosen for semantic meaning:

**Red (Anaphora):** Repetition = emphasis = red (strong emotion)
**Green (Tricolon):** Structure = balance = green (harmony)
**Blue (Alliteration):** Sound = flowing = blue (water/movement)
**Purple (Questions):** Inquiry = mystery = purple (thought)

This helps your brain associate colors with device types for faster recognition!
