/* Wizard Tearoom CMS - Main Application */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Import configuration manager
import configManager from './config.js';

// Configuration will be loaded dynamically
let firebaseConfig = null;
let githubConfig = null;

// Firebase app will be initialized after config is loaded
let app = null;
let auth = null;
let db = null;

class WizardTearoomCMS {
    constructor() {
        this.currentSection = 'carousel';
        this.currentUser = null;
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Show loading indicator
            this.showLoadingIndicator('Loading configuration...');
            
            // Load configuration
            await configManager.loadConfig();
            firebaseConfig = configManager.getFirebaseConfig();
            githubConfig = configManager.getGitHubConfig();
            
            // Initialize Firebase with loaded config
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            
            // Setup CMS
            this.setupAuthListeners();
            this.setupEventListeners();
            
            this.initialized = true;
            this.hideLoadingIndicator();
            
        } catch (error) {
            this.showConfigError(error.message);
        }
    }

    showLoadingIndicator(message = 'Loading...') {
        // Create overlay instead of replacing body content
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(135deg, #2C5530 0%, #1a3d1f 100%);
                color: white;
                font-family: 'Georgia', serif;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 9999;
            ">
                <div class="loading-spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h2>${message}</h2>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoadingIndicator() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    showConfigError(message) {
        document.body.innerHTML = `
            <div class="error-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(135deg, #8B0000 0%, #4a0000 100%);
                color: white;
                font-family: 'Georgia', serif;
                padding: 20px;
                text-align: center;
            ">
                <h1>🚨 Configuration Error</h1>
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    max-width: 600px;
                ">
                    <p><strong>Error:</strong> ${message}</p>
                </div>
                <div style="text-align: left; max-width: 600px; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                    <h3>Setup Instructions:</h3>
                    <ol>
                        <li><strong>Development:</strong> Create <code>cms/config/dev-config.json</code> using the template</li>
                        <li><strong>Production:</strong> Ensure build process injects CMS_CONFIG</li>
                        <li>Check the <a href="../CMS-README.md" style="color: #ffcc00;">CMS README</a> for detailed setup</li>
                    </ol>
                </div>
                <button onclick="window.location.reload()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #ffcc00;
                    color: #000;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">Retry</button>
            </div>
        `;
    }

    setupAuthListeners() {
        onAuthStateChanged(auth, (user) => {
            if (user && user.email === 'harriet@thewizardtearoom.co.uk') {
                this.currentUser = user;
                
                this.showCMS();
                this.loadSection(this.currentSection);
                
                const userEmailElement = document.getElementById('user-email');
                if (userEmailElement) {
                    userEmailElement.textContent = user.email;
                }
            } else {
                this.currentUser = null;
                this.showAuth();
                if (user && user.email !== 'harriet@thewizardtearoom.co.uk') {
                    this.showError('Access denied. Please contact administrator.');
                    signOut(auth);
                }
            }
        });
    }

    setupEventListeners() {
        // Auth form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Logout button will be set up when CMS is shown
    }

    async login() {
        if (!this.initialized) {
            this.showAuthError('System not initialized. Please refresh the page.');
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('auth-error');
        const loadingDiv = document.getElementById('auth-loading');

        if (!email || !password) {
            this.showAuthError('Please fill in all fields');
            return;
        }

        try {
            errorDiv.style.display = 'none';
            loadingDiv.style.display = 'flex';

            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            loadingDiv.style.display = 'none';
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'User account not found. Please check if the account exists in Firebase Console.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Invalid password. Please check your password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/invalid-api-key':
                    errorMessage = 'Invalid Firebase API key. Please check your configuration.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password authentication is not enabled in Firebase Console.';
                    break;
                default:
                    errorMessage = `Login failed: ${error.code} - ${error.message}`;
            }
            
            this.showAuthError(errorMessage);
        }
    }

    async logout() {
        try {
            await signOut(auth);
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('cms-container').style.display = 'none';
        document.getElementById('auth-loading').style.display = 'none';
    }

    showCMS() {
        const authContainer = document.getElementById('auth-container');
        const cmsContainer = document.getElementById('cms-container');
        
        if (authContainer) {
            authContainer.style.display = 'none';
        }
        
        if (cmsContainer) {
            cmsContainer.style.display = 'flex';
        }
        
        // Set up logout button event listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Set up navigation event listeners now that the CMS is visible
        this.setupNavigationListeners();
    }

    setupNavigationListeners() {
        // Navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.target.dataset.section || e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    }

    showAuthError(message) {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    switchSection(section) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-section="${section}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.currentSection = section;
        this.loadSection(section);
    }

    loadSection(section) {
        const content = document.getElementById('cms-content');
        
        // Clear existing messages
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
        
        switch(section) {
            case 'carousel':
                this.loadCarouselSection(content);
                break;
            case 'menus':
                this.loadMenusSection(content);
                break;
            case 'instagram':
                this.loadInstagramSection(content);
                break;
            case 'jobs':
                this.loadJobsSection(content);
                break;
        }
    }

    // CAROUSEL MANAGEMENT
    loadCarouselSection(content) {
        content.innerHTML = `
            <div class="section active">
                <h2>🖼️ Carousel Images</h2>
                <div class="upload-area" id="carousel-upload">
                    <h3>Upload New Carousel Image</h3>
                    <p>Drag & drop an image here or click to select<br>
                    <small>Recommended size: 1200x800px • Formats: JPG, PNG</small></p>
                    <input type="file" id="carousel-file" accept="image/*" class="file-input">
                    <button class="cms-btn" id="upload-carousel">Upload Image</button>
                </div>
                <div class="current-items" id="carousel-items">
                    <div class="loading-message">
                        <div class="spinner"></div>
                        Loading current images...
                    </div>
                </div>
            </div>
        `;

        this.setupCarouselListeners();
        this.loadCarouselImages();
    }

    setupCarouselListeners() {
        const uploadArea = document.getElementById('carousel-upload');
        const fileInput = document.getElementById('carousel-file');
        const uploadBtn = document.getElementById('upload-carousel');

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                fileInput.files = files;
                this.uploadCarouselImage();
            }
        });

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) {
                this.uploadCarouselImage();
            }
        });

        uploadBtn.addEventListener('click', () => {
            this.uploadCarouselImage();
        });
    }

    async uploadCarouselImage() {
        const fileInput = document.getElementById('carousel-file');
        const file = fileInput.files[0];

        if (!file) {
            this.showMessage('Please select an image file', 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showMessage('Image size must be less than 5MB', 'error');
            return;
        }

        try {
            this.showLoadingOverlay('Uploading image...');

            // Upload to GitHub
            const imagePath = `assets/images/carousel/${Date.now()}-${file.name}`;
            const imageUrl = await this.uploadToGitHub(file, imagePath);

            // Save to Firestore
            await addDoc(collection(db, 'carousel'), {
                url: imageUrl,
                filename: file.name,
                path: imagePath,
                uploadDate: new Date(),
                order: Date.now()
            });

            this.hideLoadingOverlay();
            this.showMessage('Image uploaded successfully!', 'success');
            this.loadCarouselImages();
            fileInput.value = '';
            
            // Trigger site update
            await this.triggerSiteUpdate();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to upload image: ' + error.message, 'error');
            console.error('Upload error:', error);
        }
    }

    async loadCarouselImages() {
        try {
            const q = query(collection(db, 'carousel'), orderBy('order', 'desc'));
            const querySnapshot = await getDocs(q);
            const items = document.getElementById('carousel-items');
            
            if (querySnapshot.empty) {
                items.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <h3>No carousel images yet</h3>
                        <p>Upload your first image to get started!</p>
                    </div>
                `;
                return;
            }

            items.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <img src="${data.url}" alt="${data.filename}" loading="lazy">
                    <h4>${data.filename}</h4>
                    <p>Uploaded: ${data.uploadDate.toDate().toLocaleDateString()}</p>
                    <div class="item-actions">
                        <button class="delete-btn" onclick="cms.deleteCarouselImage('${doc.id}', '${data.path}')">
                            Delete
                        </button>
                    </div>
                `;
                items.appendChild(card);
            });
        } catch (error) {
            document.getElementById('carousel-items').innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="color: var(--error);">Failed to load carousel images</p>
                </div>
            `;
            console.error('Error loading carousel:', error);
        }
    }

    async deleteCarouselImage(docId, imagePath) {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            this.showLoadingOverlay('Deleting image...');

            // Delete from Firestore
            await deleteDoc(doc(db, 'carousel', docId));
            
            // Delete from GitHub
            await this.deleteFromGitHub(imagePath);

            this.hideLoadingOverlay();
            this.showMessage('Image deleted successfully!', 'success');
            this.loadCarouselImages();
            await this.triggerSiteUpdate();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to delete image: ' + error.message, 'error');
            console.error('Delete error:', error);
        }
    }

    // MENU MANAGEMENT
    loadMenusSection(content) {
        content.innerHTML = `
            <div class="section active">
                <h2>📋 Menu Management</h2>
                <div class="upload-area">
                    <h3>Upload Menu</h3>
                    <p>Upload a menu image or PDF file<br>
                    <small>Formats: JPG, PNG, PDF • Max size: 10MB</small></p>
                    <select id="menu-type" class="select-input">
                        <option value="food">Food Menu</option>
                        <option value="drinks">Drinks Menu</option>
                        <option value="ice-cream">Ice Cream Menu</option>
                        <option value="specials">Daily Specials</option>
                    </select>
                    <input type="file" id="menu-file" accept=".pdf,.jpg,.jpeg,.png" class="file-input">
                    <button class="cms-btn" id="upload-menu">Upload Menu</button>
                </div>
                <div class="current-items" id="menu-items">
                    <div class="loading-message">
                        <div class="spinner"></div>
                        Loading current menus...
                    </div>
                </div>
            </div>
        `;

        this.setupMenuListeners();
        this.loadMenus();
    }

    setupMenuListeners() {
        document.getElementById('upload-menu').addEventListener('click', () => {
            this.uploadMenu();
        });
    }

    async uploadMenu() {
        const fileInput = document.getElementById('menu-file');
        const typeSelect = document.getElementById('menu-type');
        const file = fileInput.files[0];
        const type = typeSelect.value;

        if (!file) {
            this.showMessage('Please select a file', 'error');
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            this.showMessage('Please select a valid image or PDF file', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showMessage('File size must be less than 10MB', 'error');
            return;
        }

        try {
            this.showLoadingOverlay('Uploading menu...');

            const extension = file.name.split('.').pop();
            const menuPath = `assets/images/menus/${type}-menu.${extension}`;
            const menuUrl = await this.uploadToGitHub(file, menuPath);

            // Update/replace existing menu of this type
            await setDoc(doc(db, 'menus', type), {
                url: menuUrl,
                filename: file.name,
                path: menuPath,
                uploadDate: new Date(),
                type: type,
                fileType: file.type
            });

            this.hideLoadingOverlay();
            this.showMessage('Menu uploaded successfully!', 'success');
            this.loadMenus();
            fileInput.value = '';

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to upload menu: ' + error.message, 'error');
            console.error('Menu upload error:', error);
        }
    }

    async loadMenus() {
        try {
            const querySnapshot = await getDocs(collection(db, 'menus'));
            const items = document.getElementById('menu-items');
            
            if (querySnapshot.empty) {
                items.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <h3>No menus uploaded yet</h3>
                        <p>Upload your first menu to get started!</p>
                    </div>
                `;
                return;
            }

            items.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'item-card';
                
                const isPdf = data.fileType === 'application/pdf';
                const displayImage = isPdf ? 
                    `<div style="background: var(--cream); height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 2px solid var(--cream);">
                        <span style="font-size: 4rem;">📄</span>
                    </div>` :
                    `<img src="${data.url}" alt="${data.filename}" loading="lazy">`;

                card.innerHTML = `
                    ${displayImage}
                    <h4>${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Menu</h4>
                    <p>${data.filename}</p>
                    <p>Uploaded: ${data.uploadDate.toDate().toLocaleDateString()}</p>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="window.open('${data.url}', '_blank')">
                            View
                        </button>
                        <button class="delete-btn" onclick="cms.deleteMenu('${doc.id}', '${data.path}')">
                            Delete
                        </button>
                    </div>
                `;
                items.appendChild(card);
            });
        } catch (error) {
            document.getElementById('menu-items').innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="color: var(--error);">Failed to load menus</p>
                </div>
            `;
            console.error('Error loading menus:', error);
        }
    }

    async deleteMenu(docId, menuPath) {
        if (!confirm('Are you sure you want to delete this menu?')) return;

        try {
            this.showLoadingOverlay('Deleting menu...');

            await deleteDoc(doc(db, 'menus', docId));
            await this.deleteFromGitHub(menuPath);

            this.hideLoadingOverlay();
            this.showMessage('Menu deleted successfully!', 'success');
            this.loadMenus();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to delete menu: ' + error.message, 'error');
            console.error('Menu delete error:', error);
        }
    }

    // INSTAGRAM MANAGEMENT
    loadInstagramSection(content) {
        content.innerHTML = `
            <div class="section active">
                <h2>📸 Instagram Settings</h2>
                <div class="upload-area">
                    <h3>Instagram Feed Configuration</h3>
                    <p>Configure your Instagram feed credentials<br>
                    <small>Get your access token from <a href="https://developers.facebook.com/tools/explorer/" target="_blank">Facebook Graph API Explorer</a></small></p>
                    <input type="text" id="instagram-token" placeholder="Instagram Access Token" class="text-input">
                    <input type="text" id="instagram-user" placeholder="Instagram User ID" class="text-input">
                    <button class="cms-btn" id="save-instagram">Save Credentials</button>
                </div>
                <div id="instagram-status" class="instagram-preview">
                    <div class="loading-message">
                        <div class="spinner"></div>
                        Loading Instagram settings...
                    </div>
                </div>
            </div>
        `;

        this.setupInstagramListeners();
        this.loadInstagramSettings();
    }

    setupInstagramListeners() {
        document.getElementById('save-instagram').addEventListener('click', () => {
            this.saveInstagramCredentials();
        });
    }

    async saveInstagramCredentials() {
        const token = document.getElementById('instagram-token').value.trim();
        const userId = document.getElementById('instagram-user').value.trim();

        if (!token || !userId) {
            this.showMessage('Please fill in both fields', 'error');
            return;
        }

        try {
            this.showLoadingOverlay('Saving credentials...');

            await setDoc(doc(db, 'settings', 'instagram'), {
                accessToken: token,
                userId: userId,
                updatedDate: new Date(),
                enabled: true
            });

            this.hideLoadingOverlay();
            this.showMessage('Instagram credentials saved successfully!', 'success');
            this.loadInstagramSettings();
            await this.triggerSiteUpdate();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to save credentials: ' + error.message, 'error');
            console.error('Instagram save error:', error);
        }
    }

    async loadInstagramSettings() {
        try {
            const docRef = doc(db, 'settings', 'instagram');
            const docSnap = await getDocs(collection(db, 'settings'));
            const statusDiv = document.getElementById('instagram-status');
            
            let instagramData = null;
            docSnap.forEach((doc) => {
                if (doc.id === 'instagram') {
                    instagramData = doc.data();
                }
            });

            if (instagramData) {
                statusDiv.innerHTML = `
                    <h4>✅ Instagram Feed Configured</h4>
                    <p><strong>User ID:</strong> ${instagramData.userId}</p>
                    <p><strong>Last Updated:</strong> ${instagramData.updatedDate.toDate().toLocaleString()}</p>
                    <p><strong>Status:</strong> <span style="color: var(--success);">Active</span></p>
                `;
                
                // Pre-fill form with existing data (partial token for security)
                document.getElementById('instagram-user').value = instagramData.userId;
                document.getElementById('instagram-token').placeholder = 'Token saved (enter new token to update)';
            } else {
                statusDiv.innerHTML = `
                    <h4>⚠️ Instagram Feed Not Configured</h4>
                    <p>Please enter your Instagram credentials above to enable the feed.</p>
                    <p><strong>Instructions:</strong></p>
                    <ol style="text-align: left; margin-top: 1rem;">
                        <li>Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank">Facebook Graph API Explorer</a></li>
                        <li>Generate an access token for Instagram Basic Display</li>
                        <li>Get your Instagram User ID</li>
                        <li>Enter both values above and save</li>
                    </ol>
                `;
            }
        } catch (error) {
            document.getElementById('instagram-status').innerHTML = `
                <h4 style="color: var(--error);">❌ Error Loading Settings</h4>
                <p>Failed to load Instagram configuration.</p>
            `;
            console.error('Error loading Instagram settings:', error);
        }
    }

    // JOB MANAGEMENT
    loadJobsSection(content) {
        content.innerHTML = `
            <div class="section active">
                <h2>💼 Job Vacancies</h2>
                <div class="upload-area">
                    <h3>Create Job Posting</h3>
                    <p>Add a new job vacancy to your careers page</p>
                    <input type="text" id="job-title" placeholder="Job Title (e.g., Kitchen Assistant)" class="text-input">
                    <textarea id="job-description" placeholder="Job description, responsibilities, and requirements..." class="textarea-input" rows="4"></textarea>
                    <select id="job-type" class="select-input">
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="casual">Casual</option>
                    </select>
                    <input type="text" id="job-salary" placeholder="Salary/Rate (optional)" class="text-input">
                    <button class="cms-btn" id="create-job">Create Job Posting</button>
                </div>
                <div class="current-items" id="job-items">
                    <div class="loading-message">
                        <div class="spinner"></div>
                        Loading current jobs...
                    </div>
                </div>
            </div>
        `;

        this.setupJobListeners();
        this.loadJobs();
    }

    setupJobListeners() {
        document.getElementById('create-job').addEventListener('click', () => {
            this.createJob();
        });
    }

    async createJob() {
        const title = document.getElementById('job-title').value.trim();
        const description = document.getElementById('job-description').value.trim();
        const type = document.getElementById('job-type').value;
        const salary = document.getElementById('job-salary').value.trim();

        if (!title || !description) {
            this.showMessage('Please fill in the job title and description', 'error');
            return;
        }

        try {
            this.showLoadingOverlay('Creating job posting...');

            await addDoc(collection(db, 'jobs'), {
                title: title,
                description: description,
                type: type,
                salary: salary || null,
                postedDate: new Date(),
                active: true
            });

            this.hideLoadingOverlay();
            this.showMessage('Job posting created successfully!', 'success');
            this.loadJobs();
            
            // Clear form
            document.getElementById('job-title').value = '';
            document.getElementById('job-description').value = '';
            document.getElementById('job-salary').value = '';
            document.getElementById('job-type').value = 'full-time';
            
            await this.triggerSiteUpdate();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to create job posting: ' + error.message, 'error');
            console.error('Job creation error:', error);
        }
    }

    async loadJobs() {
        try {
            const q = query(collection(db, 'jobs'), orderBy('postedDate', 'desc'));
            const querySnapshot = await getDocs(q);
            const items = document.getElementById('job-items');
            
            if (querySnapshot.empty) {
                items.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <h3>No job vacancies posted yet</h3>
                        <p>Create your first job posting above!</p>
                    </div>
                `;
                return;
            }

            items.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'item-card job-card';
                card.innerHTML = `
                    <div style="background: var(--cream); height: 120px; display: flex; align-items: center; justify-content: center; border-radius: 10px; margin-bottom: 1rem; border: 2px solid var(--cream);">
                        <span style="font-size: 3rem;">💼</span>
                    </div>
                    <h4>${data.title}</h4>
                    <div class="job-meta">
                        <span class="job-type">${data.type}</span>
                        <span class="job-date">${data.postedDate.toDate().toLocaleDateString()}</span>
                    </div>
                    <p style="text-align: left; margin: 1rem 0; font-size: 0.9rem; line-height: 1.4;">
                        ${data.description.length > 100 ? data.description.substring(0, 100) + '...' : data.description}
                    </p>
                    ${data.salary ? `<p style="font-weight: 600; color: var(--success);">💰 ${data.salary}</p>` : ''}
                    <div class="item-actions">
                        <button class="delete-btn" onclick="cms.deleteJob('${doc.id}')">
                            Delete
                        </button>
                    </div>
                `;
                items.appendChild(card);
            });
        } catch (error) {
            document.getElementById('job-items').innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="color: var(--error);">Failed to load job postings</p>
                </div>
            `;
            console.error('Error loading jobs:', error);
        }
    }

    async deleteJob(docId) {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            this.showLoadingOverlay('Deleting job posting...');

            await deleteDoc(doc(db, 'jobs', docId));

            this.hideLoadingOverlay();
            this.showMessage('Job posting deleted successfully!', 'success');
            this.loadJobs();
            await this.triggerSiteUpdate();

        } catch (error) {
            this.hideLoadingOverlay();
            this.showMessage('Failed to delete job posting: ' + error.message, 'error');
            console.error('Job deletion error:', error);
        }
    }

    // GITHUB INTEGRATION
    async uploadToGitHub(file, path) {
        try {
            const base64 = await this.fileToBase64(file);
            
            // Check if file exists (for updates)
            let sha = null;
            try {
                const existing = await this.getGitHubFile(path);
                sha = existing.sha;
            } catch (e) {
                // File doesn't exist, that's fine
            }

            // Upload/update file
            const response = await fetch(`${githubConfig.apiBase}/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update ${path} via CMS`,
                    content: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
                    sha: sha // Include if updating existing file
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${errorData.message}`);
            }
            
            const result = await response.json();
            return result.content.download_url;
            
        } catch (error) {
            throw new Error(`Failed to upload to GitHub: ${error.message}`);
        }
    }

    async deleteFromGitHub(path) {
        try {
            // Get file SHA first
            const fileData = await this.getGitHubFile(path);
            
            const response = await fetch(`${githubConfig.apiBase}/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Delete ${path} via CMS`,
                    sha: fileData.sha
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('GitHub delete error:', error);
            // Don't throw here - file might already be deleted
        }
    }

    async getGitHubFile(path) {
        const response = await fetch(`${githubConfig.apiBase}/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`, {
            headers: { 'Authorization': `token ${githubConfig.token}` }
        });
        
        if (!response.ok) throw new Error('File not found');
        return response.json();
    }

    async triggerSiteUpdate() {
        try {
            const response = await fetch(`${githubConfig.apiBase}/${githubConfig.owner}/${githubConfig.repo}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'content-update'
                })
            });

            if (response.ok) {

            } else {
                console.error('Failed to trigger site update:', await response.text());
            }
        } catch (error) {
            console.error('Failed to trigger site update:', error);
        }
    }

    // UTILITY FUNCTIONS
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        const existing = container.querySelector('.message');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.className = `message ${type}-message`;
        div.textContent = message;
        
        container.appendChild(div);
        
        if (type === 'success') {
            setTimeout(() => div.remove(), 5000);
        }
    }

    showLoadingOverlay(message) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.remove();
    }
}

// Initialize CMS
const cms = new WizardTearoomCMS();

// Make cms available globally for onclick handlers
window.cms = cms;