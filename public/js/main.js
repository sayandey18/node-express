// Main JavaScript file for admin dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize all components
    initializeSidebar();
    initializeUserMenu();
    initializePasswordToggle();
    initializeFormValidation();
    initializeToasts();
    initializePasswordStrength();
    
    console.log('Admin dashboard initialized');
});

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (!sidebar || !overlay || !mobileMenuButton) return;
    
    // Toggle sidebar on mobile
    mobileMenuButton.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    });
}

// User menu dropdown
function initializeUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (!userMenuButton || !userDropdown) return;
    
    userMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdown.classList.add('hidden');
    });
    
    // Prevent dropdown from closing when clicking inside
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Password visibility toggle
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('#toggle-password, #toggle-confirm-password');
    
    toggleButtons.forEach(button => {
        if (!button) return;
        
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                passwordInput.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            
            // Re-initialize icons
            lucide.createIcons();
        });
    });
}

// Form validation and submission
function initializeFormValidation() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmission);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleFormSubmission);
        initializePasswordMatch();
    }
}

function handleFormSubmission(e) {
    const form = e.target;
    const submitBtn = form.querySelector('#submit-btn');
    const submitText = form.querySelector('#submit-text');
    const submitSpinner = form.querySelector('#submit-spinner');
    
    // Show loading state
    if (submitBtn && submitText && submitSpinner) {
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        submitSpinner.classList.remove('hidden');
    }
    
    // For demo purposes, you would typically prevent default and handle with AJAX
    // e.preventDefault();
    // handleAjaxSubmission(form);
}

// Password matching validation
function initializePasswordMatch() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorDiv = document.getElementById('password-match-error');
    
    if (!passwordInput || !confirmPasswordInput || !errorDiv) return;
    
    function checkPasswordMatch() {
        if (confirmPasswordInput.value === '') {
            errorDiv.classList.add('hidden');
            return;
        }
        
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorDiv.classList.remove('hidden');
            confirmPasswordInput.classList.add('border-red-300');
        } else {
            errorDiv.classList.add('hidden');
            confirmPasswordInput.classList.remove('border-red-300');
        }
    }
    
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    passwordInput.addEventListener('input', checkPasswordMatch);
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthText = document.getElementById('strength-text');
    const strengthIndicators = [
        document.getElementById('strength-1'),
        document.getElementById('strength-2'),
        document.getElementById('strength-3'),
        document.getElementById('strength-4')
    ];
    
    if (!passwordInput || !strengthText || strengthIndicators.some(el => !el)) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Reset all indicators
        strengthIndicators.forEach(indicator => {
            indicator.className = 'h-1 flex-1 bg-gray-200 rounded';
        });
        
        // Update based on strength
        if (strength.score >= 1) {
            strengthIndicators[0].classList.add('strength-weak');
        }
        if (strength.score >= 2) {
            strengthIndicators[1].classList.add('strength-fair');
        }
        if (strength.score >= 3) {
            strengthIndicators[2].classList.add('strength-good');
        }
        if (strength.score >= 4) {
            strengthIndicators[3].classList.add('strength-strong');
        }
        
        strengthText.textContent = strength.text;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let text = 'Very weak';
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    switch (score) {
        case 0:
        case 1:
            text = 'Very weak - Use 8+ characters with a mix of letters, numbers & symbols.';
            break;
        case 2:
            text = 'Weak - Add more character variety.';
            break;
        case 3:
            text = 'Fair - Consider adding more complexity.';
            break;
        case 4:
            text = 'Good - Your password is fairly strong.';
            break;
        case 5:
            text = 'Excellent - Your password is very strong!';
            break;
    }
    
    return { score, text };
}

// Toast notifications
function initializeToasts() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast transform translate-x-full opacity-0`;
    
    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    toast.innerHTML = `
        <div class="p-4 ${colors[type]} border rounded-lg">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i data-lucide="${icons[type]}" class="h-5 w-5"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex text-gray-400 hover:text-gray-600" onclick="this.closest('.toast').remove()">
                        <i data-lucide="x" class="h-4 w-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // Show toast
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // Auto-remove toast
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Utility functions
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

// Example usage for search functionality
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder="Search..."]');
    if (!searchInput) return;
    
    const debouncedSearch = debounce(function(query) {
        console.log('Searching for:', query);
        // Implement your search logic here
    }, 300);
    
    searchInput.addEventListener('input', function() {
        debouncedSearch(this.value);
    });
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', initializeSearch);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An unexpected error occurred. Please try again.', 'error');
});

// Export functions for global use
window.AdminDashboard = {
    showToast,
    debounce
};