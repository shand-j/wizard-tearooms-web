#!/bin/bash

# The Wizard Tearoom CMS Setup Script
# This script helps you set up the CMS for local development

echo "🧙 The Wizard Tearoom CMS Setup"
echo "================================="
echo ""

# Create necessary directories
mkdir -p cms/css
mkdir -p cms/js
mkdir -p cms/config

echo "✅ CMS directories created"

# Check if environment template exists
if [ ! -f ".env.template" ]; then
    echo "❌ Environment template not found. Please check your installation."
    exit 1
fi

echo ""
echo "🔧 Local Development Setup Steps:"
echo "1. Copy environment template:"
echo "   cp .env.template .env"
echo ""
echo "2. Edit .env with your actual credentials:"
echo "   nano .env"
echo ""
echo "3. Generate development configuration:"
echo "   ./scripts/generate-dev-config.sh"
echo ""
echo "4. Start development server:"
echo "   npx serve . -l 3000"
echo ""
echo "5. Visit: http://localhost:3000/cms/"
echo ""

echo "🔑 Required Environment Variables for .env:"
echo "   • FIREBASE_API_KEY - From Firebase Console > Project Settings > General"
echo "   • FIREBASE_AUTH_DOMAIN - Usually: your-project-id.firebaseapp.com"
echo "   • FIREBASE_PROJECT_ID - Your Firebase project ID"
echo "   • FIREBASE_STORAGE_BUCKET - Usually: your-project-id.firebasestorage.app"  
echo "   • FIREBASE_MESSAGING_SENDER_ID - From Firebase Console"
echo "   • FIREBASE_APP_ID - From Firebase Console"
echo "   • GITHUB_OWNER - Your GitHub username"
echo "   • GITHUB_REPO - Your repository name"
echo "   • GITHUB_TOKEN - Personal Access Token from GitHub"
echo ""

echo "🔐 Firebase Authentication Setup:"
echo "   • Go to Firebase Console > Authentication"
echo "   • Enable Email/Password sign-in method"
echo "   • Create user: harriet@thewizardtearoom.co.uk"
echo ""

echo "📚 For production deployment, see CMS-README.md"
echo ""

# Check if node is available
if command -v npx &> /dev/null; then
    echo "✅ Node.js is available - you can proceed with setup"
else
    echo "❌ Node.js not found. Please install Node.js first:"
    echo "   https://nodejs.org/"
fi