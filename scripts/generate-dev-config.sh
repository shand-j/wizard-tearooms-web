#!/bin/bash

# Generate development configuration from environment variables
# This script reads environment variables and creates the dev-config.json file

echo "🔧 Generating development configuration..."

# Check if .env file exists
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
required_vars=(
    "FIREBASE_API_KEY"
    "FIREBASE_AUTH_DOMAIN"
    "FIREBASE_PROJECT_ID"
    "FIREBASE_STORAGE_BUCKET"
    "FIREBASE_MESSAGING_SENDER_ID"
    "FIREBASE_APP_ID"
    "GITHUB_OWNER"
    "GITHUB_REPO"
    "GITHUB_TOKEN"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '   %s\n' "${missing_vars[@]}"
    echo ""
    echo "Please set these environment variables or create a .env file with:"
    echo "cp .env.template .env"
    echo "# Then edit .env with your actual values"
    exit 1
fi

# Generate dev-config.json
cat > cms/config/dev-config.json << EOF
{
  "firebase": {
    "apiKey": "${FIREBASE_API_KEY}",
    "authDomain": "${FIREBASE_AUTH_DOMAIN}",
    "projectId": "${FIREBASE_PROJECT_ID}",
    "storageBucket": "${FIREBASE_STORAGE_BUCKET}",
    "messagingSenderId": "${FIREBASE_MESSAGING_SENDER_ID}",
    "appId": "${FIREBASE_APP_ID}"
  },
  "github": {
    "owner": "${GITHUB_OWNER}",
    "repo": "${GITHUB_REPO}",
    "token": "${GITHUB_TOKEN}",
    "apiBase": "https://api.github.com/repos"
  }
}
EOF

echo "✅ Development configuration generated successfully!"
echo "📁 Created: cms/config/dev-config.json"
echo ""
echo "🚀 You can now start the development server:"
echo "   npx serve . -l 3000"
echo "   Visit: http://localhost:3000/cms/"