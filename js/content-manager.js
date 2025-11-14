/* Content Manager - Load dynamic content from CMS */

// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Firebase configuration (same as CMS)
const firebaseConfig = {
    apiKey: "AIzaSyBhoPOFa1UN1wKPEpprntaOT-zU-cFDXHs",
    authDomain: "wizardtearoom-4c56a.firebaseapp.com",
    projectId: "wizardtearoom-4c56a",
    storageBucket: "wizardtearoom-4c56a.firebasestorage.app",
    messagingSenderId: "739516033635",
    appId: "1:739516033635:web:8b9c8f5c5f5c5f5f5f5f5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class ContentManager {
    constructor() {
        this.dataCache = {};
        this.init();
    }

    async init() {
        // Load all content on page load
        await this.loadAllContent();
        
        // Setup periodic refresh (every 5 minutes)
        setInterval(() => this.loadAllContent(), 5 * 60 * 1000);
    }

    async loadAllContent() {
        try {
            await Promise.all([
                this.loadCarouselImages(),
                this.loadMenus(),
                this.loadInstagramFeed(),
                this.loadJobs()
            ]);
        } catch (error) {
            console.warn('Some content failed to load:', error);
        }
    }

    async fetchData(endpoint) {
        // Special handling for Firebase collections
        if (endpoint === 'menus') {
            return await this.fetchMenusFromFirebase();
        }
        if (endpoint === 'jobs') {
            return await this.fetchJobsFromFirebase();
        }
        if (endpoint === 'carousel') {
            return await this.fetchCarouselFromFirebase();
        }

        try {
            // Try to fetch from data directory for other content
            const response = await fetch(`/data/${endpoint}.json`);
            if (response.ok) {
                const data = await response.json();
                this.dataCache[endpoint] = data;
                return data;
            }
        } catch (error) {
            console.warn(`Failed to load ${endpoint} data:`, error);
        }
        
        // Return cached data or empty array/object
        return this.dataCache[endpoint] || (endpoint === 'menus' ? {} : []);
    }

    async fetchMenusFromFirebase() {
        try {
            // Check cache first
            if (this.dataCache['menus']) {
                return this.dataCache['menus'];
            }

            const querySnapshot = await getDocs(collection(db, 'menus'));
            const menusData = {};
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                menusData[doc.id] = {
                    url: data.url,
                    filename: data.filename,
                    type: data.type,
                    fileType: data.fileType,
                    uploadDate: data.uploadDate?.toDate?.() ? data.uploadDate.toDate().toISOString() : new Date().toISOString()
                };
            });

            this.dataCache['menus'] = menusData;
            return menusData;
            
        } catch (error) {
            console.warn('Failed to load menus from Firebase, falling back to local data:', error);
            
            // Fallback to local JSON file
            try {
                const response = await fetch(`/data/menus.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.dataCache['menus'] = data;
                    return data;
                }
            } catch (localError) {
                console.warn('Failed to load local menus data:', localError);
            }
            
            return this.dataCache['menus'] || {};
        }
    }

    async fetchJobsFromFirebase() {
        try {
            // Check cache first
            if (this.dataCache['jobs']) {
                return this.dataCache['jobs'];
            }

            const querySnapshot = await getDocs(collection(db, 'jobs'));
            const jobsData = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                jobsData.push({
                    id: doc.id,
                    title: data.title,
                    type: data.type,
                    description: data.description,
                    requirements: data.requirements,
                    salary: data.salary,
                    location: data.location,
                    isActive: data.active !== false, // Use 'active' field from CMS
                    datePosted: data.postedDate?.toDate?.() ? data.postedDate.toDate().toISOString() : new Date().toISOString(), // Use 'postedDate' from CMS
                    applicationEmail: data.applicationEmail || 'harriet@thewizardtearoom.co.uk'
                });
            });

            // Filter only active jobs and sort by date posted (newest first)
            const activeJobs = jobsData
                .filter(job => job.isActive)
                .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));

            this.dataCache['jobs'] = activeJobs;
            return activeJobs;
            
        } catch (error) {
            console.warn('Failed to load jobs from Firebase, falling back to local data:', error);
            
            // Fallback to local JSON file
            try {
                const response = await fetch(`/data/jobs.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.dataCache['jobs'] = data;
                    return data;
                }
            } catch (localError) {
                console.warn('Failed to load local jobs data:', localError);
            }
            
            return this.dataCache['jobs'] || [];
        }
    }

    async fetchCarouselFromFirebase() {
        try {
            // Check cache first
            if (this.dataCache['carousel']) {
                return this.dataCache['carousel'];
            }

            const querySnapshot = await getDocs(collection(db, 'carousel'));
            const carouselData = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                carouselData.push({
                    id: doc.id,
                    url: data.url,
                    filename: data.filename,
                    order: data.order || Date.now(),
                    uploadDate: data.uploadDate?.toDate?.() ? data.uploadDate.toDate().toISOString() : new Date().toISOString()
                });
            });

            // Sort by order (newest first by default)
            const sortedCarousel = carouselData.sort((a, b) => b.order - a.order);

            this.dataCache['carousel'] = sortedCarousel;
            return sortedCarousel;
            
        } catch (error) {
            console.warn('Failed to load carousel from Firebase, falling back to local data:', error);
            
            // Fallback to local JSON file
            try {
                const response = await fetch(`/data/carousel.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.dataCache['carousel'] = data;
                    return data;
                }
            } catch (localError) {
                console.warn('Failed to load local carousel data:', localError);
            }
            
            return this.dataCache['carousel'] || [];
        }
    }

    async loadCarouselImages() {
        const carouselData = await this.fetchData('carousel');
        const heroSection = document.querySelector('.hero-image-carousel');
        
        if (!heroSection || !carouselData.length) {
            console.log('Carousel: No data or hero section not found');
            return;
        }

        console.log(`Carousel: Loading ${carouselData.length} images`);

        // Update carousel images
        const carouselContainer = heroSection.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.innerHTML = carouselData.map((image, index) => `
                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image.url}" alt="${image.filename}" loading="${index === 0 ? 'eager' : 'lazy'}">
                </div>
            `).join('');

            // Update navigation dots
            const dotsContainer = heroSection.querySelector('.carousel-dots');
            if (dotsContainer) {
                dotsContainer.innerHTML = carouselData.map((_, index) => `
                    <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
                `).join('');
            }

            // Reinitialize carousel if needed
            if (window.initializeCarousel) {
                window.initializeCarousel();
            }
        }
    }

    async loadMenus() {
        const menusData = await this.fetchData('menus');
        
        // Update menus page if we're on it
        if (window.location.pathname.includes('menus')) {
            this.updateMenusPage(menusData);
        }
        
        // Update any menu links in navigation
        this.updateMenuLinks(menusData);
    }

    updateMenusPage(menusData) {
        const menuSections = document.querySelector('.menu-sections');
        if (!menuSections) return;

        const menuTypes = {
            'food': { title: 'Food Menu', icon: '', description: 'Delicious homemade dishes' },
            'drinks': { title: 'Drinks Menu', icon: '', description: 'Hot and cold beverages' },
            'ice-cream': { title: 'Ice Cream Menu', icon: '', description: 'Artisan ice cream flavors' }
        };

        const menuHTML = Object.keys(menuTypes).map(type => {
            const menu = menusData[type];
            const menuInfo = menuTypes[type];
            
            if (!menu) {
                return `
                    <div class="menu-section">
                        <div class="menu-header">
                            <span class="menu-icon">${menuInfo.icon}</span>
                            <h3>${menuInfo.title}</h3>
                        </div>
                        <p>${menuInfo.description}</p>
                        <p style="color: #666; font-style: italic;">Menu coming soon</p>
                    </div>
                `;
            }

            const isPdf = menu.fileType === 'application/pdf';
            return `
                <div class="menu-section">
                    <div class="menu-header">
                        <span class="menu-icon">${menuInfo.icon}</span>
                        <h3>${menuInfo.title}</h3>
                    </div>
                    <p>${menuInfo.description}</p>
                    <div class="menu-preview">
                        ${isPdf ? 
                            `<div class="pdf-preview-card" data-pdf-url="${menu.url}">
                                <div class="pdf-thumbnail-container">
                                    <canvas class="pdf-thumbnail" data-pdf-src="${menu.url}"></canvas>
                                    <div class="pdf-loading">Loading preview...</div>
                                </div>
                                <button class="pdf-view-btn" data-pdf-url="${menu.url}" data-menu-title="${menuInfo.title}">
                                    View Menu
                                </button>
                            </div>` :
                            `<img src="${menu.url}" alt="${menu.filename}" loading="lazy" class="menu-image">`
                        }
                    </div>
                    ${!isPdf ? 
                        `<a href="${menu.url}" target="_blank" class="menu-link">
                            View Full Menu →
                        </a>` : ''
                    }
                    <p class="menu-updated">Updated: ${new Date(menu.uploadDate).toLocaleDateString()}</p>
                </div>
            `;
        }).join('');

        menuSections.innerHTML = menuHTML;
        
        // Set up PDF view functionality for all PDF buttons
        this.setupPDFViewers();
        
        // Generate PDF thumbnails after DOM update
        setTimeout(() => {
            this.generatePDFThumbnails();
        }, 100);
    }

    setupPDFViewers() {
        document.querySelectorAll('.pdf-view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const pdfUrl = e.target.dataset.pdfUrl;
                const menuTitle = e.target.dataset.menuTitle;
                this.openPDF(pdfUrl, menuTitle);
            });
        });
    }

    async generatePDFThumbnails() {
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            console.warn('PDF.js not loaded, PDF thumbnails unavailable');
            return;
        }

        const thumbnails = document.querySelectorAll('.pdf-thumbnail');
        
        for (const canvas of thumbnails) {
            const pdfUrl = canvas.dataset.pdfSrc;
            const loadingDiv = canvas.parentElement.querySelector('.pdf-loading');
            
            try {
                // Use PDF.js to render first page as thumbnail
                const loadingTask = pdfjsLib.getDocument({
                    url: pdfUrl,
                    // Configure for Firebase Storage URLs
                    enableXfa: true,
                    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                    cMapPacked: true
                });
                
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                
                // Scale down for thumbnail
                const viewport = page.getViewport({ scale: 0.3 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                // Hide loading text and show canvas
                loadingDiv.style.display = 'none';
                canvas.style.display = 'block';
                
            } catch (error) {
                console.error('Error generating PDF thumbnail for', pdfUrl, ':', error);
                
                // Show a placeholder instead
                loadingDiv.innerHTML = `
                    <div style="
                        width: 200px; 
                        height: 260px; 
                        background: #f5f5f5; 
                        border: 2px solid #ddd; 
                        border-radius: 8px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: #666;
                        font-size: 14px;
                        text-align: center;
                        margin: 0 auto;
                    ">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
                            PDF Menu
                        </div>
                    </div>
                `;
            }
        }
    }

    openPDF(url, menuTitle) {
        console.log(`Opening ${menuTitle} PDF:`, url);
        // Open PDF with 50% zoom by default
        window.open(`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}#zoom=50`, '_blank');
    }

    updateMenuLinks(menusData) {
        document.querySelectorAll('[data-menu-type]').forEach(link => {
            const menuType = link.dataset.menuType;
            const menu = menusData[menuType];
            
            if (menu) {
                link.href = menu.url;
                link.target = '_blank';
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
            } else {
                link.href = '#';
                link.style.opacity = '0.5';
                link.style.pointerEvents = 'none';
                link.title = 'Menu not available yet';
            }
        });
    }

    async loadInstagramFeed() {
        const instagramData = await this.fetchData('instagram');
        const instagramSection = document.querySelector('#instagram-feed');
        
        if (!instagramSection || !instagramData || !instagramData.enabled) return;

        try {
            // Load Instagram posts using the configured credentials
            const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${instagramData.accessToken}&limit=6`);
            
            if (response.ok) {
                const data = await response.json();
                this.renderInstagramFeed(data.data);
            } else {
                console.warn('Failed to load Instagram feed');
                this.renderInstagramPlaceholder();
            }
        } catch (error) {
            console.warn('Instagram feed error:', error);
            this.renderInstagramPlaceholder();
        }
    }

    renderInstagramFeed(posts) {
        const instagramGrid = document.querySelector('.instagram-grid');
        if (!instagramGrid) return;

        instagramGrid.innerHTML = posts.slice(0, 6).map(post => {
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const caption = post.caption ? post.caption.substring(0, 100) + '...' : '';
            
            return `
                <div class="instagram-item">
                    <a href="${post.permalink}" target="_blank" rel="noopener noreferrer">
                        <img src="${imageUrl}" alt="${caption}" loading="lazy">
                        <div class="instagram-overlay">
                            <span class="instagram-icon"></span>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
    }

    renderInstagramPlaceholder() {
        const instagramGrid = document.querySelector('.instagram-grid');
        if (!instagramGrid) return;

        // Show placeholder images if real feed fails
        const placeholders = Array.from({length: 6}, (_, i) => `
            <div class="instagram-item placeholder">
                <div class="placeholder-content">
                    <span style="font-size: 2rem;"></span>
                    <p>Follow us on Instagram!</p>
                </div>
            </div>
        `).join('');

        instagramGrid.innerHTML = placeholders;
    }

    async loadJobs() {
        const jobsData = await this.fetchData('jobs');
        
        // Update careers page if we're on it
        if (window.location.pathname.includes('careers')) {
            this.updateCareersPage(jobsData);
        }
        
        // Update job count in navigation or other locations
        this.updateJobCount(jobsData.length);
    }

    updateCareersPage(jobsData) {
        const jobsContainer = document.querySelector('.job-listings');
        if (!jobsContainer) return;

        if (!jobsData.length) {
            jobsContainer.innerHTML = `
                <div class="no-jobs">
                    <h3>No Current Vacancies</h3>
                    <p>Thank you for your interest in working with us! We don't have any open positions right now, but please check back soon as opportunities arise regularly.</p>
                    <p>You can also send us your CV to <a href="mailto:harriet@thewizardtearoom.co.uk">harriet@thewizardtearoom.co.uk</a> for future consideration.</p>
                </div>
            `;
            return;
        }

        const jobsHTML = jobsData.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <div class="job-meta">
                        <span class="job-type">${this.formatJobType(job.type)}</span>
                        ${job.salary ? `<span class="job-salary">${job.salary}</span>` : ''}
                    </div>
                </div>
                <div class="job-description">
                    <p>${job.description}</p>
                </div>
                <div class="job-footer">
                    <span class="job-date">Posted: ${job.datePosted ? new Date(job.datePosted).toLocaleDateString() : 'Recently'}</span>
                    <a href="mailto:harriet@thewizardtearoom.co.uk?subject=Application for ${encodeURIComponent(job.title)}" class="apply-btn">
                        Apply Now →
                    </a>
                </div>
            </div>
        `).join('');

        jobsContainer.innerHTML = jobsHTML;
    }

    formatJobType(type) {
        const types = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'seasonal': 'Seasonal',
            'casual': 'Casual'
        };
        return types[type] || type;
    }

    updateJobCount(count) {
        document.querySelectorAll('[data-job-count]').forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });

        // Update careers link visibility
        document.querySelectorAll('[data-careers-link]').forEach(link => {
            if (count > 0) {
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
                link.title = `${count} job${count !== 1 ? 's' : ''} available`;
            } else {
                link.style.opacity = '0.7';
                link.style.pointerEvents = 'auto';
                link.title = 'No current vacancies';
            }
        });
    }

    // Public method to manually refresh content
    async refresh() {
        await this.loadAllContent();
    }

    // Public method to get cached data
    getData(type) {
        return this.dataCache[type] || null;
    }
}

// Initialize content manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentManager = new ContentManager();
    });
} else {
    window.contentManager = new ContentManager();
}

// Export for use in other scripts
window.ContentManager = ContentManager;