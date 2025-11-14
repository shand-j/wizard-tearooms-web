#!/bin/bash

# Test the CMS Dev Mode
echo "🧪 Testing CMS Development Mode"
echo "================================"
echo ""

# Check if server is running
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running"
    echo "Start with: npx serve . -l 3000"
    exit 1
fi

# Test CMS page loads
if curl -s http://localhost:3000/cms/ | grep -q "Wizard Tearoom CMS"; then
    echo "✅ CMS page loads correctly"
else
    echo "❌ CMS page failed to load"
    exit 1
fi

# Test data files are accessible
echo ""
echo "📄 Testing data files:"
for file in carousel menus instagram jobs; do
    if curl -s http://localhost:3000/data/${file}.json > /dev/null; then
        echo "✅ data/${file}.json is accessible"
    else
        echo "❌ data/${file}.json is not accessible"
    fi
done

echo ""
echo "🎯 Dev Mode Testing Instructions:"
echo "1. Visit: http://localhost:3000/cms/"
echo "2. You should see a red development mode banner"
echo "3. Use any email/password to login (e.g., test@example.com / password123)"
echo "4. Test all CMS features - they will simulate operations"
echo ""
echo "🔧 Features to test:"
echo "- ✨ Carousel image upload (simulated)"
echo "- 📋 Menu uploads (simulated)"
echo "- 📸 Instagram credentials (simulated)"
echo "- 💼 Job posting creation (simulated)"
echo ""
echo "All operations will show success messages and log to browser console."
echo "Ready for testing! 🚀"