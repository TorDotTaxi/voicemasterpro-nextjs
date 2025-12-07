#!/bin/bash

# VoiceMaster Pro Next.js - Quick Start Script

echo "========================================="
echo "   VoiceMaster Pro - Next.js"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found!"
    echo "The file has been created with default API keys."
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
echo "========================================="
echo "   App will open at:"
echo "   http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop"
echo "========================================="
echo ""

npm run dev

