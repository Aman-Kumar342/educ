// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    initializeApp();
});

async function loadPartials() {
    const partialMap = {
        header: 'partials/header.html',
        hero: 'partials/hero.html',
        courses: 'partials/courses.html',
        about: 'partials/about.html',
        resources: 'partials/resources.html',
        testimonials: 'partials/testimonials.html',
        contact: 'partials/contact.html',
        footer: 'partials/footer.html',
        'scroll-top': 'partials/scroll-top.html'
    };

    const containers = Array.from(document.querySelectorAll('[data-partial]'));

    await Promise.all(containers.map(async (container) => {
        const key = container.getAttribute('data-partial');
        const path = partialMap[key];
        if (!path) return;

        try {
            const response = await fetch(path);
            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error(`Failed to load partial: ${key}`, error);
        }
    }));
}

function initializeApp() {
    initNavigation();
    initThemeToggle();
    initSearchFunctionality();
    initCourseFiltering();
    initFormValidation();
    initScrollEffects();
    initHeroStats();
    initCourseEnrollment();
    initResourceExploration();
    initNewsletter();
    console.log('✅ Educ platform initialized successfully with advanced features!');
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Smooth scrolling and close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                if (navToggle) navToggle.textContent = '☰';
            }
        });
    });

    // Highlight active nav link on scroll
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add animation effect
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const courseCards = document.querySelectorAll('.course-card');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let foundCount = 0;

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                foundCount++;
            } else if (searchTerm !== '') {
                card.style.display = 'none';
                card.classList.add('hidden');
            } else {
                card.style.display = 'block';
                card.classList.remove('hidden');
                foundCount++;
            }
        });

        // Show notification
        if (searchTerm !== '' && foundCount === 0) {
            showNotification('No courses found matching your search', 'warning');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
                searchInput.blur();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// ==================== COURSE FILTERING ====================
function initCourseFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            let visibleCount = 0;

            // Filter courses with animation
            courseCards.forEach((card, index) => {
                setTimeout(() => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            card.classList.remove('hidden');
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                            card.classList.add('hidden');
                        }
                    }
                }, index * 50);
            });

            // Show count notification
            setTimeout(() => {
                const categoryName = filterValue === 'all' ? 'All Courses' : button.textContent;
                showNotification(`Showing ${visibleCount} ${categoryName} courses`, 'info');
            }, courseCards.length * 50);
        });
    });
}

// ==================== HERO STATS COUNTER ====================
function initHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // Use Intersection Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// ==================== FORM VALIDATION ====================
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        errorElement.classList.remove('show');
    }

    function validateName() {
        const nameValue = nameInput.value.trim();
        
        if (nameValue === '') {
            showError(nameInput, 'Name is required');
            return false;
        } else if (nameValue.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(nameValue)) {
            showError(nameInput, 'Name can only contain letters');
            return false;
        } else {
            clearError(nameInput);
            return true;
        }
    }

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValue === '') {
            showError(emailInput, 'Email is required');
            return false;
        } else if (!emailPattern.test(emailValue)) {
            showError(emailInput, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailInput);
            return true;
        }
    }

    function validateMessage() {
        const messageValue = messageInput.value.trim();
        
        if (messageValue === '') {
            showError(messageInput, 'Message is required');
            return false;
        } else if (messageValue.length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            return false;
        } else if (messageValue.length > 500) {
            showError(messageInput, 'Message must not exceed 500 characters');
            return false;
        } else {
            clearError(messageInput);
            return true;
        }
    }

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('error')) validateName();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) validateEmail();
        });
    }

    if (messageInput) {
        messageInput.addEventListener('blur', validateMessage);
        messageInput.addEventListener('input', () => {
            if (messageInput.classList.contains('error')) validateMessage();
        });
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();
            
            if (isNameValid && isEmailValid && isMessageValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                setTimeout(() => {
                    formSuccess.classList.add('show');
                    contactForm.reset();
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                    
                    showNotification('Message sent successfully!', 'success');

                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);
                }, 1000);
            } else {
                showNotification('Please fix the errors in the form', 'error');
            }
        });
    }
}

// ==================== COURSE ENROLLMENT ====================
function initCourseEnrollment() {
    const enrollButtons = document.querySelectorAll('.btn-secondary');
    
    enrollButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            const courseName = courseCard.querySelector('h3').textContent;
            const progressBar = courseCard.querySelector('.progress-fill');
            
            // Animate progress bar
            const randomProgress = Math.floor(Math.random() * 30) + 10;
            progressBar.style.width = `${randomProgress}%`;
            
            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = 'Enrolling...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Continue Learning';
                button.disabled = false;
                showNotification(`Successfully enrolled in ${courseName}!`, 'success');
            }, 1000);
        });
    });
}

// ==================== RESOURCE EXPLORATION ====================
function initResourceExploration() {
    const resourceButtons = document.querySelectorAll('.resource-btn');
    
    resourceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const resourceCard = e.target.closest('.resource-card');
            const resourceType = resourceCard.getAttribute('data-resource');
            const resourceTitle = resourceCard.querySelector('h3').textContent;
            
            // Add pulse animation
            resourceCard.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                resourceCard.style.animation = '';
            }, 500);
            
            showNotification(`Opening ${resourceTitle}...`, 'info');
            
            // Simulate resource loading
            setTimeout(() => {
                console.log(`Resource type: ${resourceType}`);
                showNotification(`${resourceTitle} loaded successfully!`, 'success');
            }, 1500);
        });
    });
}

// ==================== NEWSLETTER ====================
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            
            if (emailInput.value.trim() !== '') {
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    showNotification('Successfully subscribed to newsletter!', 'success');
                    newsletterForm.reset();
                    submitButton.textContent = 'Subscribe';
                    submitButton.disabled = false;
                }, 1000);
            }
        });
    }
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top functionality
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.course-card, .resource-card, .feature-card, .testimonial-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Hero CTA button
    const heroButton = document.querySelector('.hero .btn-primary');
    if (heroButton) {
        heroButton.addEventListener('click', () => {
            const coursesSection = document.getElementById('courses');
            coursesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '300px'
    });

    // Set background color based on type
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            showNotification('Search activated', 'info');
        }
    }
    
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
    }
});

// ==================== PERFORMANCE MONITORING ====================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
});
