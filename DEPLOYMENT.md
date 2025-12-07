# 🚀 Deployment Guide - VoiceMaster Pro Next.js

Complete guide to deploy your app to production with GitHub integration.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier available)
- ✅ All API keys ready
- ✅ Code pushed to GitHub repository

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended - Easiest)
### Option 2: Netlify
### Option 3: GitHub Pages (Static Export)
### Option 4: Self-Hosted (VPS/Docker)

---

## 🌟 Option 1: Deploy to Vercel (RECOMMENDED)

Vercel is created by the Next.js team and offers best performance.

### Step 1: Push to GitHub

```bash
cd voicemasterpro-nextjs

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VoiceMaster Pro"

# Create GitHub repository first, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voicemasterpro-nextjs.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your repository**: `voicemasterpro-nextjs`
4. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

5. **Add Environment Variables** (CRITICAL):
   ```
   NEXT_PUBLIC_GEMINI_API_KEY = AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
   NEXT_PUBLIC_DEEPGRAM_API_KEY = 4acc334413436e98e24c15b7e48dc2ced6216f2c
   NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY = AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
   NEXT_PUBLIC_FPT_AI_API_KEY = dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
   NEXT_PUBLIC_ASSEMBLY_AI_API_KEY = abee456b3f9342fc90cfc44aeb2f2501
   ```

6. **Click "Deploy"**

7. **Done!** Your app will be live at:
   ```
   https://your-project-name.vercel.app
   ```

### Step 3: Auto-Deploy on Push

**Already configured!** Every time you push to `main` branch, Vercel will:
- ✅ Automatically build
- ✅ Run tests
- ✅ Deploy to production

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys! 🚀
```

### Step 4: Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Add your custom domain (e.g., `voicemaster.com`)
3. Update DNS records as instructed
4. SSL certificate auto-configured!

---

## 🎨 Option 2: Deploy to Netlify

### Step 1: Build for Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init
```

### Step 2: Configure

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_GEMINI_API_KEY = "your_key"
  NEXT_PUBLIC_DEEPGRAM_API_KEY = "your_key"
  # ... add all keys
```

### Step 3: Deploy

```bash
netlify deploy --prod
```

---

## 📄 Option 3: GitHub Pages (Static Export)

**Note**: GitHub Pages only supports static sites. Some features may be limited.

### Step 1: Configure for Static Export

Update `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // ... rest of config
}
```

### Step 2: Build and Export

```bash
npm run build
```

The static files will be in the `out` directory.

### Step 3: Deploy to GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Copy build files
cp -r out/* .

# Push to gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Step 4: Enable GitHub Pages

1. Go to your repo → Settings → Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` → `/ (root)`
4. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/voicemasterpro-nextjs`

---

## 🐳 Option 4: Self-Hosted (Docker)

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t voicemasterpro .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \
  -e NEXT_PUBLIC_DEEPGRAM_API_KEY=your_key \
  voicemasterpro
```

---

## 🤖 GitHub Actions CI/CD

The project includes `.github/workflows/deploy.yml` which:

### Features:
- ✅ Runs on every push to `main`
- ✅ Tests on Node.js 18 and 20
- ✅ Lints code
- ✅ Builds project
- ✅ Auto-deploys to Vercel

### Setup GitHub Secrets:

Go to: **Your Repo → Settings → Secrets and variables → Actions**

Add these secrets:

```
GEMINI_API_KEY = AIzaSyAwYuKHRkLg7_uvZfmU7AnbrJSO2ykweQw
DEEPGRAM_API_KEY = 4acc334413436e98e24c15b7e48dc2ced6216f2c
GOOGLE_CLOUD_API_KEY = AIzaSyCKRoXy5fAYQENKhlDDCGnu4axn_hsok7s
FPT_AI_API_KEY = dIP80FYgNqy0U1iMb0MlyU5h95FVOmBi
ASSEMBLY_AI_API_KEY = abee456b3f9342fc90cfc44aeb2f2501
```

For Vercel auto-deployment, also add:

```
VERCEL_TOKEN = (Get from vercel.com/account/tokens)
VERCEL_ORG_ID = (Get from vercel project settings)
VERCEL_PROJECT_ID = (Get from vercel project settings)
```

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] App loads successfully
- [ ] Recording works
- [ ] Transcription works (test with short audio)
- [ ] TTS generates audio
- [ ] STT processes files
- [ ] History saves and loads
- [ ] Dark mode toggles
- [ ] No console errors
- [ ] API keys are working
- [ ] Mobile responsive

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure all vars start with `NEXT_PUBLIC_`
- Restart dev server after adding vars
- In Vercel, redeploy after adding vars

### API Errors in Production

- Check browser console
- Verify API keys in deployment platform
- Ensure CORS is configured for APIs

---

## 📊 Performance Optimization

### For Production:

1. **Enable Image Optimization**
   ```javascript
   // next.config.js
   images: {
     formats: ['image/avif', 'image/webp'],
   }
   ```

2. **Add Analytics** (optional)
   ```bash
   npm install @vercel/analytics
   ```

3. **Enable Compression**
   ```javascript
   // next.config.js
   compress: true,
   ```

---

## 🌍 Custom Domain Setup

### On Vercel:

1. **Add Domain**
   - Project Settings → Domains
   - Add your domain: `voicemaster.com`

2. **Configure DNS** (at your domain provider):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for SSL** (automatic, takes ~1 hour)

---

## 📱 Progressive Web App (PWA)

Make it installable:

```bash
npm install next-pwa
```

Update `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA({
  // ... your config
})
```

---

## 🎉 Success!

Your app is now live! Share the URL:

```
https://your-project.vercel.app
```

Every push to `main` will auto-deploy! 🚀

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Actions**: https://docs.github.com/actions

---

**Made with ❤️ | VoiceMaster Pro Team**

