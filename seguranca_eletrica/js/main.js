// Main JavaScript for Segurança Elétrica Digital

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize module cards
    initModuleCards();
    
    // Initialize progress tracking
    initProgressTracking();
    
    // Initialize animations
    initAnimations();
    
    // Initialize responsive features
    initResponsiveFeatures();

    // >>> NOVO CÓDIGO ADICIONADO AQUI <<<
    // Initialize closing mobile nav on outside click
    initMobileNavCloseOnClickOutside();
}

// >>> FUNÇÃO NOVA ADICIONADA AQUI <<<
/**
 * Fecha o menu de navegação móvel (hamburger) se o usuário clicar
 * em qualquer lugar fora da área da navbar.
 */
function initMobileNavCloseOnClickOutside() {
    const navbar = document.querySelector('.navbar'); // A tag <nav> inteira
    const navbarCollapse = document.querySelector('.navbar-collapse'); // O menu que abre/fecha

    // Adiciona um "escutador" de cliques no documento inteiro
    document.addEventListener('click', function (event) {
        // Verifica se o menu está atualmente aberto/visível
        const isMenuOpen = navbarCollapse.classList.contains('show');
        
        // Verifica se o clique foi FORA da área da navbar
        // A função .contains() checa se o elemento clicado é um descendente da navbar
        const isClickOutside = !navbar.contains(event.target);

        // Se o menu estiver aberto E o clique foi fora...
        if (isMenuOpen && isClickOutside) {
            // Pega a instância do componente Collapse do Bootstrap associada ao nosso menu
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false // Garante que apenas vamos fechar, sem reabrir
            });
            // Usa o método oficial do Bootstrap para fechar o menu
            bsCollapse.hide();
        }
    });
}


// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // O código abaixo já fechava o menu ao clicar em um link, o que é ótimo!
                // Nosso novo código adiciona o fechamento ao clicar em qualquer outro lugar.
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// Module Cards Interaction
function initModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            openModule(module);
        });
        
        // Add keyboard support
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const module = this.dataset.module;
                openModule(module);
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
}

function openModule(moduleName) {
    // Show loading state
    showLoading();
    
    // Simulate loading time
    setTimeout(() => {
        hideLoading();
        
        // Navigate to module page
        switch(moduleName) {
            case 'introducao':
                window.location.href = 'pages/introducao.html';
                break;
            case 'riscos':
                window.location.href = 'pages/riscos.html';
                break;
            case 'montagem':
                window.location.href = 'pages/montagem.html';
                break;
            case 'manutencao':
                window.location.href = 'pages/manutencao.html';
                break;
            default:
                showNotification('Módulo em desenvolvimento', 'info');
        }
    }, 1000);
}

// Progress Tracking
function initProgressTracking() {
    // Load progress from localStorage
    loadProgress();
    
    // Update progress bars
    updateProgressBars();
}

function loadProgress() {
    const savedProgress = localStorage.getItem('segurancaEletricaProgress');
    if (savedProgress) {
        window.moduleProgress = JSON.parse(savedProgress);
    } else {
        window.moduleProgress = {
            introducao: 0,
            riscos: 0,
            montagem: 0,
            manutencao: 0
        };
    }
}

function saveProgress() {
    localStorage.setItem('segurancaEletricaProgress', JSON.stringify(window.moduleProgress));
}

function updateProgress(module, progress) {
    window.moduleProgress[module] = progress;
    saveProgress();
    updateProgressBars();
    
    // Mark module as completed if 100%
    if (progress === 100) {
        const moduleCard = document.querySelector(`[data-module="${module}"]`);
        if (moduleCard) {
            moduleCard.classList.add('completed');
            showNotification('Módulo concluído!', 'success');
        }
    }
}

function updateProgressBars() {
    Object.keys(window.moduleProgress).forEach(module => {
        const progressBar = document.querySelector(`[data-module="${module}"] .progress-bar`);
        if (progressBar) {
            const progress = window.moduleProgress[module];
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .module-card, .about-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // Electric animation for hero icons
    animateElectricIcons();
}

function animateElectricIcons() {
    const electricIcons = document.querySelectorAll('.electric-icon');
    
    electricIcons.forEach((icon, index) => {
        // Add random pulse delays
        icon.style.animationDelay = `${index * 0.5 + Math.random() * 2}s`;
        
        // Add click interaction
        icon.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 2s infinite';
            }, 100);
        });
    });
}

// Responsive Features
function initResponsiveFeatures() {
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();
    
    // Touch support for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        initTouchSupport();
    }
}

function handleResize() {
    const isMobile = window.innerWidth < 768;
    
    // Adjust hero section height on mobile
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        if (isMobile) {
            heroSection.style.minHeight = '100vh';
        } else {
            heroSection.style.minHeight = '100vh';
        }
    }
    
    // Adjust component layout in simulator preview
    adjustSimulatorLayout();
}

function adjustSimulatorLayout() {
    const componentIcons = document.querySelector('.component-icons');
    const isMobile = window.innerWidth < 576;
    
    if (componentIcons) {
        if (isMobile) {
            componentIcons.style.flexDirection = 'column';
            componentIcons.style.alignItems = 'center';
        } else {
            componentIcons.style.flexDirection = 'row';
            componentIcons.style.alignItems = 'stretch';
        }
    }
}

function initTouchSupport() {
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .module-card, .feature-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Utility Functions
function showLoading() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading"></div>
            <p class="mt-3 text-white">Carregando módulo...</p>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 102, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showNotification(message, type = 'info') {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} notification`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 10px;
    }
    
    .touch-device .btn:hover,
    .touch-device .module-card:hover,
    .touch-device .feature-card:hover {
        transform: none;
    }
    
    @media (max-width: 576px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for use in other modules
window.SegurancaEletrica = {
    updateProgress,
    showNotification,
    showLoading,
    hideLoading
};