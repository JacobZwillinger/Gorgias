# Deployment Guide

## Quick Start

This app is ready to deploy to Vercel with pre-cached results for 4 sample texts (Declaration of Independence, Gettysburg Address, I Have a Dream, Churchill speech).

---

## GitLab Setup

### 1. Create GitLab Repository

1. Go to [gitlab.com](https://gitlab.com)
2. Click **New Project** → **Create blank project**
3. Name: `gorgias`
4. Visibility: Private (or Public if you prefer)
5. Click **Create project**

### 2. Connect Local Repository

```bash
cd /Users/jz/Desktop/Gorgias

# Add GitLab remote (replace with your actual GitLab URL)
git remote add origin git@gitlab.com:yourusername/gorgias.git

# Push to GitLab
git push -u origin main
```

**Note:** Replace `yourusername` with your actual GitLab username.

---

## Vercel Deployment

### 1. Deploy from GitLab

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import from **GitLab**
4. Select your `gorgias` repository
5. Click **Deploy**

Vercel will automatically:
- Detect the `vercel.json` configuration
- Build the project
- Deploy the serverless function at `/api/analyze`

### 2. Your App is Live!

After deployment, you'll get a URL like:
```
https://gorgias-xyz123.vercel.app
```

The 4 sample texts will work immediately with pre-cached results (no API key needed).

---

## Adding Claude API (Optional)

Currently, the app works with 4 pre-cached sample texts. If you want to analyze custom text, you'll need to add a Claude API key.

### 1. Get API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-...`)

**Note:** This is separate from your Claude.ai account. You'll need to add credits to your Anthropic Console account.

### 2. Add to Vercel

1. Go to your Vercel dashboard
2. Select your `gorgias` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your API key (paste `sk-ant-...`)
   - **Environment:** Production
5. Click **Save**
6. Redeploy the project (Vercel will prompt you)

### 3. How It Works

- **With API key:** Custom text analysis uses Claude API (~$0.01-0.02 per request)
- **Without API key:** Only the 4 cached sample texts work
- **Local fallback:** If API fails, falls back to pattern-based detection

---

## Cost Breakdown

### Free Tier (Current Setup)
- ✅ 4 sample texts work perfectly (pre-cached)
- ✅ No API costs
- ✅ Vercel free tier (100GB bandwidth, unlimited requests)

### With API Key
- ✅ Custom text analysis enabled
- 💵 ~$0.01-0.02 per analysis (Claude 3.5 Sonnet)
- 💵 Anthropic Console account needs credits ($5 minimum)

---

## Cached Samples

These texts return instant results without API calls:

1. **Declaration of Independence**
2. **Gettysburg Address**
3. **I Have a Dream speech**
4. **Churchill "We Shall Fight" speech**

Cached results are stored in `/api/analyze.js` and include:
- Detected rhetorical devices
- Highlighted text ranges
- Device categories and counts

---

## GitLab Workflow

### Making Changes

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically detect the push and redeploy.

### Branches

Create feature branches for experimentation:

```bash
git checkout -b feature/new-detectors
# Make changes
git push origin feature/new-detectors
```

Create a merge request in GitLab to review before merging to main.

---

## Project Structure

```
/Users/jz/Desktop/Gorgias/
├── api/
│   └── analyze.js          # Vercel serverless function (cached results + API)
├── detectors/              # Pattern-based detectors
│   ├── anaphora.js
│   ├── alliteration.js
│   ├── tricolon.js
│   ├── rhetorical-question.js
│   └── epizeuxis.js
├── index.html              # Main input page
├── results.html            # Analysis results page
├── app.js                  # Frontend logic
├── results.js              # Results page logic
├── mock-api.js             # Detector orchestration
├── styles.css              # Dark theme styles
├── rhetoric-devices.json   # Device definitions
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies
└── .gitignore              # Git ignore rules
```

---

## Troubleshooting

### Issue: Sample buttons don't work locally

**Solution:** Serve with a local server (ES6 modules require HTTP):

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve

# Then open: http://localhost:8000
```

### Issue: API returns error for custom text

**Cause:** No API key configured (by design - cached samples only for now)

**Solution:** Add `ANTHROPIC_API_KEY` environment variable in Vercel (see section above)

### Issue: Git push to GitLab fails

**Cause:** SSH key not set up

**Solution:**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitLab: Settings → SSH Keys → Paste `~/.ssh/id_ed25519.pub`
3. Retry push

---

## Next Steps

1. ✅ **Deploy to Vercel** - Get the app live
2. ✅ **Test cached samples** - Verify 4 sample texts work
3. 🔜 **Add API key** (optional) - Enable custom text analysis
4. 🔜 **Customize** - Add more detectors or improve UI

---

## Support

- **Vercel docs:** https://vercel.com/docs
- **GitLab docs:** https://docs.gitlab.com
- **Anthropic API:** https://docs.anthropic.com

---

**Built with Claude Code**

Inspired by [havelock.ai](https://havelock.ai)
