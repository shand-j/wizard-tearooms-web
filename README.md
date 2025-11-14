# The Wizard tearoom Website

A modern, performant static website for The Wizard Tearoom - a charming country tearoom business. This site has been migrated from WordPress to GitHub Pages with enhanced design and functionality.

## 🏡 About The Business
The Wizard Tearoom is a country tearoom offering a cozy, traditional dining experience. The website showcases the establishment's charm through rich imagery and an intuitive, mobile-responsive design.

## 🚀 Features
- **Performance Optimized**: Fast loading times with optimized images and minimal dependencies
- **Mobile Responsive**: Seamless experience across all devices
- **Image-Rich Design**: Extensive use of photography to showcase the tearoom atmosphere
- **Content Management System**: Full CMS for non-technical content updates
- **Dynamic Content**: Carousel, menus, jobs, and Instagram feed management
- **SEO Friendly**: Optimized for search engines with semantic HTML structure
- **GitHub Pages Ready**: Fully compatible with GitHub Pages deployment

## 🔒 Security

This project implements secure configuration management:
- **No hardcoded credentials** in source code
- **Environment-based configuration** for sensitive data
- **Git-ignored configuration files** to prevent accidental commits
- **GitHub Secrets integration** for production deployment
- **Secure CMS authentication** via Firebase Auth

⚠️ **Important**: Never commit real API keys, tokens, or credentials to version control. See [CMS-README.md](CMS-README.md) for detailed security setup.

## 🎨 Design Philosophy
- **Country Aesthetic**: Warm, earthy color palette reflecting the rural setting
- **Enhanced UI**: Modern improvements while maintaining the cozy tearoom feel
- **User Experience**: Intuitive navigation and engaging visual storytelling

## 📁 Project Structure
```
wizard-tearoom-web/
├── index.html              # Main homepage
├── *.html                  # Additional pages (menus, careers, etc.)
├── css/
│   └── styles.css         # Main stylesheet with country tearoom theme
├── js/
│   ├── script.js          # Interactive functionality
│   └── content-manager.js # Dynamic content loading
├── cms/                    # Content Management System
│   ├── index.html         # CMS login and dashboard
│   ├── css/cms-styles.css # CMS styling
│   └── js/cms.js          # CMS functionality
├── data/                   # Dynamic content (JSON)
│   ├── carousel.json      # Carousel images
│   ├── menus.json         # Menu files
│   ├── instagram.json     # Instagram settings
│   └── jobs.json          # Job postings
├── assets/                 # Images and resources
├── .github/workflows/      # GitHub Actions
├── scripts/               # Setup and testing scripts
└── README.md
```

## 🛠 Technologies Used
- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Modern CSS with custom properties and grid/flexbox layouts
- **Vanilla JavaScript**: Lightweight interactivity without framework overhead
- **Google Fonts**: Playfair Display and Source Sans Pro for typography
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

## 🎯 Migration Checklist
- [x] Analyze existing WordPress site structure
- [x] Extract and optimize all images
- [x] Migrate menu content
- [x] Migrate about/contact information
- [x] Implement gallery functionality
- [x] Set up content management system
- [x] Performance testing and optimization
- [x] SEO optimization
- [x] Deploy to GitHub Pages
- [x] Create CMS for non-technical updates

## 🚀 Development Setup
1. Clone the repository
2. Start a local development server:
   ```bash
   npx serve . -l 3000
   ```
   or
   ```bash
   python -m http.server 3000
   ```
3. Visit the site at `http://localhost:3000`
4. Access the CMS at `http://localhost:3000/cms/`

### CMS Development Mode
- **Local testing**: Use any email/password (e.g., `test@example.com` / `password123`)
- **Dev mode features**: All uploads and operations are simulated
- **Console logging**: Check browser dev tools for operation logs

## 📱 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎨 Color Palette
- **Primary**: #8B4513 (Saddle Brown)
- **Secondary**: #D2691E (Chocolate)
- **Accent**: #F4A460 (Sandy Brown)
- **Background**: #FFF8DC (Cornsilk)
- **Text**: #2F4F4F (Dark Slate Gray)

## 📈 Performance Goals
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧙‍♀️ Content Management System
The site includes a comprehensive CMS for non-technical content updates:

### Features
- **Carousel Management**: Upload/delete hero images
- **Menu Management**: Upload menus (images/PDFs) by type
- **Instagram Integration**: Configure feed credentials  
- **Job Postings**: Create/manage career opportunities
- **Automatic Updates**: Changes sync to live site via GitHub Actions

### Access
- **Production**: `https://yourdomain.com/cms/`
- **Development**: `http://localhost:3000/cms/`
- **Login**: harriet@thewizardtearoom.co.uk

### Development Testing
- Use any credentials in dev mode
- All operations are simulated locally
- Check browser console for detailed logs

## 🔧 Production Deployment
1. Set up Firebase authentication
2. Configure GitHub repository secrets
3. Deploy to GitHub Pages
4. Configure custom domain (optional)

## 📄 License
This project is for The Wizard Tearoom business. All rights reserved.

---
Built with ❤️ for The Wizard Tearoom