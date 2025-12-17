// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
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
        }
    });
});

// Course Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter courses
        courseCards.forEach(card => {
            if (filterValue === 'all') {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 10);
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 10);
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            }
        });
    });
});

// Form Validation
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
        showError(emailInput, 'Please enter a valid email');
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
    } else {
        clearError(messageInput);
        return true;
    }
}

// Real-time validation
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);

nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('error')) {
        validateName();
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        validateEmail();
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('error')) {
        validateMessage();
    }
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();
    
    if (isNameValid && isEmailValid && isMessageValid) {
        // Show success message
        formSuccess.classList.add('show');
        
        // Clear form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 5000);
        
        console.log('Form submitted successfully!');
        console.log({
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        });
    }
});

// Interactive course buttons
const courseButtons = document.querySelectorAll('.btn-secondary');
courseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const courseName = e.target.parentElement.querySelector('h3').textContent;
        alert(`You clicked on: ${courseName}\n\nThis would normally navigate to the course page.`);
    });
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

// Add scroll animation effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all course cards and resource cards
document.querySelectorAll('.course-card, .resource-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

console.log('Educ platform initialized successfully!');
