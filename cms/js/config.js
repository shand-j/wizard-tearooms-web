/* Wizard Tearoom CMS - Configuration Management */

class ConfigManager {
    constructor() {
        this.config = null;
    }

    async loadConfig() {
        if (this.config) return this.config;

        try {
            // Try to load from production config first, then fall back to local config
            try {
                this.config = await this.loadProdConfig();
            } catch (prodError) {
                console.log('Production config not available, trying local config...');
                this.config = await this.loadDevConfig();
            }
            
            this.validateConfig();
            return this.config;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            throw new Error('Configuration loading failed. Please check setup.');
        }
    }

    async loadDevConfig() {
        try {
            const response = await fetch('/cms/config/dev-config.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const config = await response.json();
            
            // Validate that this isn't just template placeholders
            if (config.firebase.apiKey.includes('YOUR_') || config.github.token.includes('YOUR_')) {
                throw new Error('Please configure cms/config/dev-config.json with real credentials (not placeholder values)');
            }
            
            return config;
        } catch (error) {
            throw new Error(`Local config error: ${error.message}. Please create and configure cms/config/dev-config.json with your Firebase and GitHub settings.`);
        }
    }

    async loadProdConfig() {
        // In production, config is injected via build process or environment variables
        // This would be set by GitHub Actions or build process
        if (window.CMS_CONFIG) {
            return window.CMS_CONFIG;
        }
        
        throw new Error('Production configuration not found. Please ensure build process injects CMS_CONFIG.');
    }

    validateConfig() {
        const required = {
            firebase: ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'],
            github: ['owner', 'repo', 'token', 'apiBase']
        };

        for (const [section, fields] of Object.entries(required)) {
            if (!this.config[section]) {
                throw new Error(`Configuration section '${section}' is missing`);
            }
            
            for (const field of fields) {
                if (!this.config[section][field]) {
                    throw new Error(`Configuration field '${section}.${field}' is missing`);
                }
            }
        }

        // Validate token format
        if (!this.config.github.token.startsWith('ghp_')) {
            throw new Error('Invalid GitHub token format - must start with ghp_');
        }
    }

    getFirebaseConfig() {
        return this.config?.firebase || null;
    }

    getGitHubConfig() {
        return this.config?.github || null;
    }
}

// Export singleton instance
export default new ConfigManager();