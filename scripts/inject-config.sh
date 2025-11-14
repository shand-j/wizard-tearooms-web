#!/bin/bash

# Production Configuration Injection Script
# This script injects configuration from environment variables or secrets
# into the CMS for production deployment

set -e

echo "🔧 Injecting production configuration..."

# Check if we're in GitHub Actions
if [ "$GITHUB_ACTIONS" = "true" ]; then
    echo "📦 GitHub Actions environment detected"
    
    # Create production config from GitHub secrets
    cat > cms/js/prod-config.js << EOF
// Production configuration injected at build time
window.CMS_CONFIG = {
    firebase: {
        apiKey: "${FIREBASE_API_KEY}",
        authDomain: "${FIREBASE_AUTH_DOMAIN}",
        projectId: "${FIREBASE_PROJECT_ID}",
        storageBucket: "${FIREBASE_STORAGE_BUCKET}",
        messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
        appId: "${FIREBASE_APP_ID}"
    },
    github: {
        owner: "${GITHUB_REPOSITORY_OWNER}",
        repo: "${GITHUB_REPOSITORY_NAME}",
        token: "${GITHUB_TOKEN}",
        apiBase: "https://api.github.com/repos"
    }
};

console.log('🔧 Production configuration loaded');
EOF

    echo "✅ Production configuration injected successfully"
    
else
    echo "❌ Not in GitHub Actions environment"
    echo "💡 For local production testing, manually create cms/js/prod-config.js"
    exit 1
fi

echo "🚀 Ready for production deployment"