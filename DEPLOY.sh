#!/bin/bash

# VoiceMaster Pro - Deploy Script for TorDotTaxi
# This script helps you deploy to GitHub

echo "════════════════════════════════════════════════"
echo "  VoiceMaster Pro - GitHub Deploy"
echo "  Username: TorDotTaxi"
echo "════════════════════════════════════════════════"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git version: $(git --version)"
echo ""

# Check if already initialized
if [ -d ".git" ]; then
    echo "⚠️  Git repository already exists!"
    echo "Skipping initialization..."
else
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
    echo "✅ Repository initialized!"
fi

echo ""
echo "📝 Adding files..."
git add .

echo ""
echo "💾 Creating commit..."
git commit -m "Deploy VoiceMaster Pro Next.js"

echo ""
echo "🔗 Setting up remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/TorDotTaxi/voicemasterpro-nextjs.git

echo ""
echo "════════════════════════════════════════════════"
echo "  Ready to push!"
echo "════════════════════════════════════════════════"
echo ""
echo "⚠️  You will need:"
echo "   Username: TorDotTaxi"
echo "   Password: Your Personal Access Token"
echo ""
echo "   Create token at: https://github.com/settings/tokens"
echo ""
echo "🚀 Pushing to GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════"
    echo "  ✅ SUCCESS!"
    echo "════════════════════════════════════════════════"
    echo ""
    echo "📍 Your repository:"
    echo "   https://github.com/TorDotTaxi/voicemasterpro-nextjs"
    echo ""
    echo "🌐 Next step: Deploy to Vercel"
    echo "   1. Go to https://vercel.com"
    echo "   2. Import your GitHub repository"
    echo "   3. Add environment variables"
    echo "   4. Deploy!"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════"
    echo "  ❌ Push failed!"
    echo "════════════════════════════════════════════════"
    echo ""
    echo "💡 Common solutions:"
    echo "   1. Make sure repository exists on GitHub"
    echo "   2. Use Personal Access Token, not password"
    echo "   3. Check your internet connection"
    echo ""
fi

