# ⚡ Quick Start - VoiceMaster Pro Next.js

Get your app running in **under 5 minutes!**

## 🚀 Local Development

### Step 1: Install Dependencies

```bash
cd voicemasterpro-nextjs
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root with your API keys:

```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>
NEXT_PUBLIC_DEEPGRAM_API_KEY=<your_deepgram_api_key>
NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=<your_google_cloud_api_key>
NEXT_PUBLIC_FPT_AI_API_KEY=<your_fpt_ai_api_key>
NEXT_PUBLIC_ASSEMBLY_AI_API_KEY=<your_assemblyai_api_key>
```

🔐 **Get your API keys from:**
- Gemini: https://makersuite.google.com/app/apikey
- Deepgram: https://console.deepgram.com/
- FPT AI: https://fpt.ai/
- AssemblyAI: https://www.assemblyai.com/

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

```
http://localhost:3000
```

**That's it!** 🎉

---

## 🌐 Deploy to Production (5 Minutes)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voicemasterpro-nextjs.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables (same as `.env.local`)
5. Click "Deploy"

**Done!** Your app is live at `https://your-project.vercel.app` 🚀

---

## 📱 Test the App

### 1. Recording
- Click **Record** tab
- Click microphone button
- Speak for 10 seconds
- Stop and click **"Transcribe"**

### 2. Text-to-Speech
- Click **TTS** tab
- Type: "Xin chào, tôi là VoiceMaster Pro"
- Select voice gender
- Click **"Generate Speech"**
- Play the audio

### 3. Speech-to-Text
- Click **STT** tab
- Drag & drop an audio file
- Enable diarization
- Click **"Transcribe"**

### 4. History
- Click **History** tab
- View all recordings
- Search, play, or delete

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🆘 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Environment variables not found"
- Create `.env.local` file
- Copy all API keys

### "Port 3000 already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

---

## 📚 Full Documentation

- **README.md**: Feature overview
- **DEPLOYMENT.md**: Complete deployment guide
- **Architecture**: See `src/` folder structure

---

**Happy Coding!** 🎉

