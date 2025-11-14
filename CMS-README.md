# The Wizard Tearoom CMS System

A complete content management system for The Wizard Tearoom website, allowing non-technical updates to carousel images, menus, Instagram feed, and job postings.

## 🚀 System Overview

This CMS system provides:
- **Carousel Management**: Upload/delete hero images
- **Menu Management**: Upload menus (images/PDFs) by type
- **Instagram Integration**: Configure feed credentials
- **Job Postings**: Create/manage career opportunities
- **Automatic Updates**: Changes sync to live site via GitHub Actions

## 📁 File Structure

```
wizard-tearooms-web/
├── cms/                      # CMS Application
│   ├── index.html           # Login & Dashboard
│   ├── css/cms-styles.css   # CMS Styling
│   └── js/cms.js           # Core CMS Logic
├── data/                    # Dynamic Content
│   ├── carousel.json       # Carousel images
│   ├── menus.json         # Menu files
│   ├── instagram.json     # Instagram settings
│   └── jobs.json          # Job postings
├── js/content-manager.js    # Website content loader
├── .github/workflows/       # Automation
│   └── update-content.yml  # Auto-update workflow
└── scripts/setup-cms.sh    # Setup helper
```

## 🔒 Security & Configuration

⚠️ **CRITICAL SECURITY NOTICE**: This CMS handles sensitive credentials and API keys. Follow security best practices:

### 🛡️ Security Best Practices
- **Never commit real credentials** to version control
- **Use environment variables** for all sensitive configuration
- **Rotate credentials regularly** and revoke compromised tokens immediately
- **Limit token permissions** to minimum required access
- **Monitor repository access** and audit configuration changes

### Development Mode
- Configuration stored in `cms/config/dev-config.json` (git-ignored)
- Firebase authentication bypassed for testing
- Local simulation of all operations
- Use placeholder values during development

### Production Mode  
- Configuration injected at build time via GitHub Actions
- Real Firebase authentication required
- Live operations with GitHub API
- All secrets stored as GitHub repository secrets

### 🚨 Required GitHub Secrets
For production deployment, add these secrets to your repository:

**Firebase Configuration:**
- `FIREBASE_API_KEY`: Firebase Web API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain (e.g., project-id.firebaseapp.com)
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket name
- `FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `FIREBASE_APP_ID`: Firebase web app ID

**Firebase Service Account (for GitHub Actions):**
- `FIREBASE_PRIVATE_KEY_ID`: Service account private key ID
- `FIREBASE_PRIVATE_KEY`: Service account private key (full key with newlines)
- `FIREBASE_CLIENT_EMAIL`: Service account email
- `FIREBASE_CLIENT_ID`: Service account client ID

**Important**: Never commit configuration files with secrets to version control.

## 🔧 Technical Architecture

### Frontend (CMS Interface)
- **Framework**: Vanilla JavaScript ES6+
- **Authentication**: Firebase Auth (restricted to harriet@thewizardtearoom.co.uk)
- **Database**: Firestore for content storage
- **File Storage**: GitHub repository via API
- **Styling**: Custom CSS matching site theme

### Backend Integration
- **Firebase Project**: `wizardtearoom-4c56a`
- **GitHub Repository**: `shand-j/wizard-tearooms-web`
- **Auto-deployment**: GitHub Actions
- **Content Sync**: Real-time updates via Firebase triggers

### Website Integration
- **Content Loading**: Dynamic JSON-based content
- **Fallbacks**: Graceful degradation with default content
- **Performance**: Cached data with periodic refresh
- **SEO**: Server-side rendering friendly

## 🛠️ Setup Instructions

### 1. Firebase Configuration
1. Firebase project is pre-configured: `wizardtearoom-4c56a`
2. Create user account for harriet@thewizardtearoom.co.uk in Firebase Console
3. Generate service account credentials for GitHub Actions (see detailed steps below)

### 2. GitHub Secrets Configuration
Add these secrets to repository settings:
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY` 
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`

### 3. Quick Setup
```bash
./scripts/setup-cms.sh
```

## 🔐 Detailed Setup Guide for Production Deployment

### Step 1: Generate Firebase Service Account Credentials

#### 1.1 Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select the project: `wizardtearoom-4c56a`

#### 1.2 Navigate to Service Accounts
1. Click the **gear icon** (⚙️) in the left sidebar
2. Select **Project settings**
3. Click on the **Service accounts** tab
4. You should see "Firebase Admin SDK" section

#### 1.3 Generate Private Key
1. In the "Firebase Admin SDK" section, select **Node.js**
2. Click **Generate new private key** button
3. A dialog will appear warning about the key's security
4. Click **Generate key** to confirm
5. A JSON file will download automatically (e.g., `wizardtearoom-4c56a-firebase-adminsdk-xxxxx.json`)
6. **Keep this file secure** - it contains sensitive credentials

### Step 2: Configure GitHub Repository Secrets

#### 2.1 Access Repository Settings
1. Go to your GitHub repository: [https://github.com/shand-j/wizard-tearooms-web](https://github.com/shand-j/wizard-tearooms-web)
2. Click on **Settings** tab (top navigation)
3. In the left sidebar, click **Secrets and variables**
4. Select **Actions**

#### 2.2 Add Firebase Secrets
From the downloaded JSON file, extract these values and add them as repository secrets:

**Secret 1: FIREBASE_PRIVATE_KEY_ID**
- Name: `FIREBASE_PRIVATE_KEY_ID`
- Value: Copy the `private_key_id` value from JSON (without quotes)
- Example: `1234567890abcdef1234567890abcdef12345678`

**Secret 2: FIREBASE_PRIVATE_KEY**
- Name: `FIREBASE_PRIVATE_KEY`
- Value: Copy the entire `private_key` value from JSON (including quotes and newlines)
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`

**Secret 3: FIREBASE_CLIENT_EMAIL**
- Name: `FIREBASE_CLIENT_EMAIL`
- Value: Copy the `client_email` value from JSON (without quotes)
- Example: `firebase-adminsdk-xxxxx@wizardtearoom-4c56a.iam.gserviceaccount.com`

**Secret 4: FIREBASE_CLIENT_ID**
- Name: `FIREBASE_CLIENT_ID`
- Value: Copy the `client_id` value from JSON (without quotes)
- Example: `123456789012345678901`

#### 2.3 Add Each Secret
For each secret above:
1. Click **New repository secret**
2. Enter the **Name** exactly as shown
3. Paste the **Value** from your JSON file
4. Click **Add secret**
5. Repeat for all 4 secrets

### Step 3: Set Up Firebase Authentication

#### 3.1 Enable Authentication
1. In Firebase Console, go to **Authentication** in left sidebar
2. Click **Get started** if not already enabled
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

#### 3.2 Create User Account
1. Go to **Users** tab in Authentication
2. Click **Add user**
3. Enter:
   - **Email**: `harriet@thewizardtearoom.co.uk`
   - **Password**: Create a secure password
4. Click **Add user**
5. **Important**: Share these credentials securely with Harriet

### Step 4: Configure Firestore Database

#### 4.1 Create Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Select location: **europe-west2 (London)** or nearest
5. Click **Done**

#### 4.2 Set Up Collections
The CMS will automatically create these collections when first used:
- `carousel` - for carousel images
- `menus` - for menu files  
- `settings` - for Instagram credentials
- `jobs` - for job postings

### Step 5: Test the Setup

#### 5.1 Local Testing
1. Start development server: `npx serve . -l 3000`
2. Visit: `http://localhost:3000/cms/`
3. Login with any credentials (dev mode)
4. Test all sections work

#### 5.2 Production Testing
1. Deploy to GitHub Pages
2. Visit: `https://shand-j.github.io/wizard-tearooms-web/cms/`
3. Login with Harriet's Firebase credentials
4. Test actual upload/create operations

### Step 6: Monitor GitHub Actions

#### 6.1 Check Workflow
1. Go to **Actions** tab in your GitHub repository
2. You should see "Update Site Content from CMS" workflow
3. When CMS changes are made, this workflow will run automatically
4. Monitor for any errors in the workflow logs

#### 6.2 Verify Auto-Updates
1. Make a change in the CMS (e.g., upload an image)
2. Check that GitHub Actions workflow triggers
3. Verify that `data/*.json` files are updated in repository
4. Confirm changes appear on live website

## 🧪 Testing Checklist

- [ ] Firebase service account JSON downloaded
- [ ] All 4 GitHub secrets added correctly
- [ ] Firebase Authentication enabled
- [ ] User account created for Harriet
- [ ] Firestore database created
- [ ] Local CMS testing works
- [ ] Production CMS login works
- [ ] GitHub Actions workflow triggers
- [ ] Auto-updates appear on live site

## 🎯 Usage Guide

### For Harriet (Content Manager)

#### Accessing the CMS
1. Visit: `https://shand-j.github.io/wizard-tearooms-web/cms/`
2. Login with: `harriet@thewizardtearoom.co.uk`
3. Use the dashboard to manage content

#### Managing Carousel Images
- **Upload**: Drag & drop or click to select images
- **Requirements**: JPG/PNG, max 5MB, recommended 1200x800px
- **Delete**: Click delete button on any image
- **Auto-update**: Changes appear on website within minutes

#### Managing Menus
- **Types**: Food, Drinks, Ice Cream, Daily Specials
- **Formats**: Images (JPG/PNG) or PDF files, max 10MB
- **Replace**: Upload new file of same type to replace existing
- **View**: Click "View" to preview uploaded menus

#### Instagram Feed Setup
- **Requirements**: Instagram Business Account + Facebook Developer Access
- **Process**: 
  1. Get access token from Facebook Graph API Explorer
  2. Find your Instagram User ID
  3. Enter both in CMS Instagram section
  4. Save to activate feed

#### Job Postings
- **Create**: Fill in job title, description, type, and optional salary
- **Types**: Full Time, Part Time, Seasonal, Casual
- **Auto-email**: Apply buttons link to Harriet's email
- **Delete**: Remove jobs when positions are filled

### For Developers

#### Local Development
```bash
# Start development server
npx serve . -l 3000

# Visit CMS
open http://localhost:3000/cms/
```

#### Content Structure
```javascript
// Carousel Data
[{
  "id": "unique-id",
  "url": "https://...",
  "filename": "image.jpg",
  "uploadDate": "2025-01-27T12:00:00Z"
}]

// Menu Data
{
  "food": {
    "url": "https://...",
    "filename": "food-menu.pdf",
    "type": "food",
    "fileType": "application/pdf",
    "uploadDate": "2025-01-27T12:00:00Z"
  }
}

// Job Data
[{
  "id": "unique-id",
  "title": "Kitchen Assistant",
  "description": "Full job description...",
  "type": "part-time",
  "salary": "£11.50/hour",
  "postedDate": "2025-01-27T12:00:00Z"
}]
```

#### API Integration
```javascript
// Load content in website
const contentManager = new ContentManager();
await contentManager.loadAllContent();

// Get specific data
const jobs = contentManager.getData('jobs');
const menus = contentManager.getData('menus');
```

## 🔄 Workflow Process

1. **Content Update**: Harriet makes changes in CMS
2. **Firebase Storage**: Data saved to Firestore
3. **GitHub Upload**: Files uploaded to repository
4. **Action Trigger**: GitHub workflow activated
5. **Data Export**: Firebase data exported to JSON files
6. **Site Update**: Website automatically refreshes content
7. **Live Changes**: Updates appear on live site

## 🛡️ Security Features

- **Authentication**: Firebase Auth with email restriction
- **Authorization**: Only harriet@thewizardtearoom.co.uk can access
- **Data Validation**: File type/size restrictions
- **API Security**: GitHub token with minimal permissions
- **Error Handling**: Graceful fallbacks for all operations

## 📱 Mobile Responsiveness

- **CMS Interface**: Optimized for mobile content management
- **Upload Interface**: Touch-friendly drag & drop
- **Navigation**: Collapsible mobile menu
- **Forms**: Responsive input fields and buttons

## 🚨 Troubleshooting

### CMS Won't Load
- Check Firebase configuration
- Verify user account exists
- Confirm internet connection

### Images Not Uploading
- Check file size (max 5MB)
- Verify file format (JPG/PNG)
- Check GitHub API token permissions

### Site Not Updating
- Verify GitHub Actions are enabled
- Check Firebase service account secrets
- Monitor workflow logs in GitHub

### Instagram Feed Issues
- Verify access token is valid
- Check Instagram User ID format
- Confirm Facebook app permissions

## 📊 Performance Metrics

- **CMS Load time**: < 2 seconds
- **Image upload**: < 30 seconds for 5MB
- **Site update**: < 5 minutes end-to-end
- **Content refresh**: Every 5 minutes
- **Mobile performance**: 90+ Lighthouse score

## 🔮 Future Enhancements

- [ ] Bulk image upload
- [ ] Image editing tools
- [ ] Content scheduling
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multi-user support
- [ ] Content versioning
- [ ] A/B testing tools

## 📞 Support

For technical support or questions:
- **System Issues**: Check GitHub repository issues
- **Content Help**: Reference this documentation
- **Emergency**: Contact system administrator

---

*Built with ❤️ for The Wizard Tearoom - Making content management magical! 🧙‍♀️*