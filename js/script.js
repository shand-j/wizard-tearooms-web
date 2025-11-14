// The Wizard Tearoom JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links (only on same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect - solid white at top, 50% opacity when scrolled
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Hero Image Carousel
    initializeCarousel();
    
    // Instagram Feed
    initializeInstagramFeed();
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Image lazy loading for performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Gallery functionality (will be enhanced after content migration)
function initializeGallery() {
    // Gallery modal functionality will be added here
    // after we migrate the images from the WordPress site
}

// Contact form enhancement (if needed)
function initializeContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Form validation and handling will be implemented
            // based on the existing WordPress contact functionality
        });
    }
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            // Log performance metrics for optimization
            console.log('Page load time:', pageLoadTime + 'ms');
        });
    }
}

trackPerformance();

// Hero Image Carousel Functionality
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Return early if carousel elements don't exist (not on homepage)
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // Previous slide function
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Event listeners for navigation buttons
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-advance carousel every 5 seconds
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-advance on hover
    const carousel = document.querySelector('.hero-image-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left - next slide
                } else {
                    prevSlide(); // Swipe right - previous slide
                }
            }
        }
    }
}

// Instagram Feed Functionality
const mockInstagramPosts = [
    {
        id: '1',
        image_url: 'assets/images/common/outdoor-cafe.jpg',
        caption: 'Beautiful morning at the tearoom ☕️🌿 Fresh scones and peaceful woodland views make the perfect start to any day. #WizardTearoom #CountryLife #FreshBaked',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-12T08:30:00Z',
        likes: 147
    },
    {
        id: '2', 
        image_url: 'assets/images/common/meadow.jpg',
        caption: 'The meadow views from our terrace are simply breathtaking 🌾✨ Perfect spot for afternoon tea with a view. Come find your peaceful moment with us.',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-11T15:45:00Z',
        likes: 203
    },
    {
        id: '3',
        image_url: 'assets/images/common/ice-cream-window.jpeg', 
        caption: 'Our famous ice cream window is open! 🍦 Locally sourced, freshly made, and absolutely delicious. Perfect treat after exploring The Edge trails.',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-10T14:20:00Z',
        likes: 89
    },
    {
        id: '4',
        image_url: 'assets/images/common/location.jpg',
        caption: 'Nestled in the heart of the countryside 🏞️ Our unique location offers the perfect escape from the everyday. Find us at the edge of adventure!',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-09T11:00:00Z',
        likes: 176
    },
    {
        id: '5',
        image_url: 'assets/images/common/space-hire.jpg',
        caption: 'Planning a special celebration? 🎉 Our beautiful space is available for private hire. Intimate gatherings in a magical woodland setting.',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-08T16:30:00Z',
        likes: 134
    },
    {
        id: '6',
        image_url: 'assets/images/menus/afternoon-tea.jpg',
        caption: 'Traditional afternoon tea with a country twist 🫖 Fresh cakes, homemade scones, and locally sourced treats. Book your table today!',
        permalink: 'https://instagram.com/thewizardtearoom',
        timestamp: '2024-11-07T13:15:00Z',
        likes: 298
    }
];

function initializeInstagramFeed() {
    const grid = document.getElementById('instagram-grid');
    if (!grid) return;
    
    // Show loading state
    grid.classList.add('loading');
    grid.innerHTML = '<div class="instagram-loading">Loading latest posts...</div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        grid.classList.remove('loading');
        renderInstagramPosts(mockInstagramPosts);
    }, 800);
}

function renderInstagramPosts(posts) {
    const grid = document.getElementById('instagram-grid');
    if (!grid) return;
    
    grid.innerHTML = posts.map(post => `
        <div class="instagram-post" onclick="openInstagramPost('${post.permalink}')">
            <img src="${post.image_url}" alt="Instagram post" loading="lazy">
            <div class="instagram-post-content">
                <p class="instagram-caption">${post.caption}</p>
                <div class="instagram-post-meta">
                    <span class="instagram-date">${formatInstagramDate(post.timestamp)}</span>
                    <span class="instagram-likes">❤️ ${post.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add fade-in animation to posts
    const posts_elements = grid.querySelectorAll('.instagram-post');
    posts_elements.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        setTimeout(() => {
            post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function formatInstagramDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

function openInstagramPost(permalink) {
    window.open(permalink, '_blank', 'noopener,noreferrer');
}