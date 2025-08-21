// Application Form State Management
let currentStep = 1;
const totalSteps = 4;
const formData = {};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupFormValidation();
    setupEventListeners();
});

function initializeApp() {
    updateProgressBar();
    setupSmoothScrolling();
    setupNavbarEffects();
    startParticleSystem();
}

// Interactive particle system
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
    particle.style.setProperty('--dy', -(Math.random() * 150 + 50) + 'px');
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 3000);
}

function startParticleSystem() {
    // Click-to-create particles
    document.addEventListener('click', function(e) {
        // Don't create particles on form elements
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            e.target.tagName === 'SELECT' ||
            e.target.tagName === 'BUTTON') {
            return;
        }
        createParticle(e.clientX, e.clientY);
    });
    
    // Auto-generate particles occasionally
    setInterval(() => {
        if (Math.random() < 0.1) {
            createParticle(
                Math.random() * window.innerWidth,
                window.innerHeight + 10
            );
        }
    }, 2000);
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar background effects on scroll
function setupNavbarEffects() {
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.1)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
            nav.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Interactive playground effects
function setupEventListeners() {
    const playground = document.getElementById('interactive-playground');
    const codeEditor = document.getElementById('code-editor');
    
    if (playground && codeEditor) {
        playground.addEventListener('mouseenter', function() {
            codeEditor.style.borderColor = 'var(--primary-electric)';
            codeEditor.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
        });
        
        playground.addEventListener('mouseleave', function() {
            codeEditor.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            codeEditor.style.boxShadow = 'none';
        });
    }
    
    // Feature cards 3D tilt effect
    setupFeatureCardEffects();
    
    // Main CTA button interaction
    setupMainCTAEffect();
}

function setupFeatureCardEffects() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

function setupMainCTAEffect() {
    const mainCTA = document.getElementById('main-cta');
    if (mainCTA) {
        mainCTA.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create burst effect
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const rect = e.target.getBoundingClientRect();
                    createParticle(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2
                    );
                }, i * 50);
            }
            
            // Scroll to application form
            setTimeout(() => {
                document.getElementById('apply').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 600);
        });
    }
}

// Form Step Navigation
function nextStep(step) {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        showStep(step);
        updateProgressBar();
    }
}

function prevStep(step) {
    showStep(step);
    updateProgressBar();
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
        progressStep.classList.remove('active', 'completed');
        if (index + 1 < step) {
            progressStep.classList.add('completed');
        } else if (index + 1 === step) {
            progressStep.classList.add('active');
        }
    });
    
    currentStep = step;
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentStep / totalSteps) * 100;
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--accent-neon)';
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = 'var(--accent-success)';
                }
            });
            isValid = false;
        } else {
            field.style.borderColor = 'var(--accent-success)';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

function saveCurrentStepData() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const formElements = currentStepEl.querySelectorAll('input, select, textarea');
    
    formElements.forEach(element => {
        if (element.type === 'checkbox') {
            formData[element.name] = element.checked;
        } else {
            formData[element.name] = element.value;
        }
    });
}

function setupFormValidation() {
    // Real-time validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.dataset.wasInvalid) {
                validateField(this);
            }
        });
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = 'var(--accent-neon)';
                this.dataset.wasInvalid = 'true';
            } else if (this.value) {
                this.style.borderColor = 'var(--accent-success)';
                delete this.dataset.wasInvalid;
            }
        });
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Remove non-numeric characters for validation
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = this.value.replace(/\D/g, '');
            if (this.value && !phoneRegex.test(cleanPhone)) {
                this.style.borderColor = 'var(--accent-neon)';
                this.dataset.wasInvalid = 'true';
            } else if (this.value) {
                this.style.borderColor = 'var(--accent-success)';
                delete this.dataset.wasInvalid;
            }
        });
    }
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = 'var(--accent-neon)';
        field.dataset.wasInvalid = 'true';
        return false;
    } else if (field.value.trim()) {
        field.style.borderColor = 'var(--accent-success)';
        delete field.dataset.wasInvalid;
        return true;
    }
    return true;
}

// Form submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateCurrentStep()) {
        saveCurrentStepData();
        submitApplication();
    }
});

function submitApplication() {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Create submission particle effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const rect = submitBtn.getBoundingClientRect();
            createParticle(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height
            );
        }, i * 100);
    }
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Log form data (in real app, this would be sent to server)
        console.log('Application Data:', formData);
        
        // Show success modal
        showSuccessModal();
        
        // Track analytics event (example)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'application',
                'event_label': 'codeforge_application',
                'value': 1
            });
        }
        
    }, 2000); // Simulate network delay
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // Create celebration particles
        setTimeout(() => {
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    createParticle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }, i * 100);
            }
        }, 500);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset form to first step
        resetForm();
    }
}

function resetForm() {
    // Clear form data
    Object.keys(formData).forEach(key => delete formData[key]);
    
    // Reset to first step
    currentStep = 1;
    showStep(1);
    updateProgressBar();
    
    // Clear all form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type === 'checkbox') {
            field.checked = false;
        } else {
            field.value = '';
        }
        field.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        delete field.dataset.wasInvalid;
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--accent-neon)' : type === 'success' ? 'var(--accent-success)' : 'var(--primary-electric)'};
        color: var(--neutral-white);
        padding: var(--space-md) var(--space-lg);
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Advanced Form Features
function setupAdvancedFormFeatures() {
    // Auto-save form data to prevent loss
    setInterval(() => {
        saveCurrentStepData();
        localStorage.setItem('codeforge_form_data', JSON.stringify(formData));
        localStorage.setItem('codeforge_current_step', currentStep.toString());
    }, 30000); // Save every 30 seconds
    
    // Load saved data on page refresh
    const savedData = localStorage.getItem('codeforge_form_data');
    const savedStep = localStorage.getItem('codeforge_current_step');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            Object.assign(formData, parsedData);
            
            // Restore form values
            Object.keys(parsedData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = parsedData[key];
                    } else {
                        field.value = parsedData[key];
                    }
                }
            });
            
            // Restore step if valid
            if (savedStep && parseInt(savedStep) > 1) {
                const shouldRestore = confirm('We found a previously saved application. Would you like to continue where you left off?');
                if (shouldRestore) {
                    showStep(parseInt(savedStep));
                }
            }
        } catch (e) {
            console.warn('Could not restore saved form data:', e);
        }
    }
}

// Accessibility Features
function setupAccessibilityFeatures() {
    // Keyboard navigation for form steps
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in a form field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            if (validateCurrentStep()) {
                nextStep(currentStep + 1);
            }
        } else if (e.key === 'ArrowLeft' && currentStep > 1) {
            prevStep(currentStep - 1);
        }
        
        // Enter key to proceed
        if (e.key === 'Enter' && currentStep < totalSteps) {
            if (validateCurrentStep()) {
                nextStep(currentStep + 1);
            }
        }
    });
    
    // Focus management
    document.querySelectorAll('.next-step-btn, .prev-step-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Focus first input in next step
            setTimeout(() => {
                const activeStep = document.querySelector('.form-step.active');
                const firstInput = activeStep.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        });
    });
    
    // ARIA labels and descriptions
    updateAriaLabels();
}

function updateAriaLabels() {
    // Update progress indicator ARIA
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', currentStep);
        progressBar.setAttribute('aria-valuemin', '1');
        progressBar.setAttribute('aria-valuemax', totalSteps.toString());
        progressBar.setAttribute('aria-label', `Application step ${currentStep} of ${totalSteps}`);
    }
    
    // Update form step ARIA
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.setAttribute('role', 'tabpanel');
        step.setAttribute('aria-hidden', step.classList.contains('active') ? 'false' : 'true');
        step.setAttribute('aria-labelledby', `step-${index + 1}-heading`);
    });
}

// Performance Optimizations
function optimizePerformance() {
    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate any responsive elements
            updateResponsiveElements();
        }, 250);
    });
    
    // Lazy load non-critical animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

function updateResponsiveElements() {
    // Update any elements that need responsive adjustments
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// Error Handling
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e);
        showNotification('Something went wrong. Please refresh the page and try again.', 'error');
    });
    
    // Network error detection
    window.addEventListener('offline', function() {
        showNotification('You appear to be offline. Your progress has been saved locally.', 'error');
    });
    
    window.addEventListener('online', function() {
        showNotification('Connection restored!', 'success');
    });
}

// Analytics and Tracking
function trackFormProgress() {
    // Track step completions
    window.addEventListener('beforeunload', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_progress', {
                'event_category': 'application',
                'event_label': `step_${currentStep}`,
                'value': currentStep
            });
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    setupAdvancedFormFeatures();
    setupAccessibilityFeatures();
    optimizePerformance();
    setupErrorHandling();
    trackFormProgress();
});

// Add CSS animations for notifications
const notificationStyles = `
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
    
    .animate-in {
        animation: fadeInUp 0.6s ease both;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export functions for external use (if needed)
window.CodeForgeApp = {
    nextStep,
    prevStep,
    closeModal,
    resetForm,
    showNotification,
    createParticle
};