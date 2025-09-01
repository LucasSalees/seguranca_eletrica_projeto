// Module-specific JavaScript

let currentSection = 1;
let totalSections = 4;
let quizScore = 0;
let currentQuestion = 1;
let totalQuestions = 3;

document.addEventListener('DOMContentLoaded', function() {
    initializeModule();
});

function initializeModule() {
    // Initialize progress tracking
    loadModuleProgress();
    
    // Initialize quiz functionality
    initializeQuiz();
    
    // Initialize navigation dots
    initializeNavigation();
    
    // Update progress display
    updateProgressDisplay();
}

function loadModuleProgress() {
    // Get module name from URL
    const moduleName = getModuleName();
    
    // Load saved progress
    const savedProgress = localStorage.getItem('segurancaEletricaProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const moduleProgress = progress[moduleName] || 0;
        
        // Calculate current section based on progress
        currentSection = Math.floor((moduleProgress / 100) * totalSections) + 1;
        if (currentSection > totalSections) currentSection = totalSections;
        
        // Show current section
        showSection(currentSection);
        updateProgressDisplay();
    }
}

function getModuleName() {
    const path = window.location.pathname;
    if (path.includes('introducao')) return 'introducao';
    if (path.includes('riscos')) return 'riscos';
    if (path.includes('montagem')) return 'montagem';
    if (path.includes('manutencao')) return 'manutencao';
    return 'introducao';
}

function completeSection(sectionNumber) {
    // Mark section as completed
    const navDot = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (navDot) {
        navDot.classList.add('completed');
    }
    
    // Move to next section
    if (sectionNumber < totalSections) {
        currentSection = sectionNumber + 1;
        showSection(currentSection);
        updateProgressDisplay();
    } else {
        // Module completed
        completeModule();
    }
    
    // Save progress
    saveModuleProgress();
}

function showSection(sectionNumber) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update navigation dots
    updateNavigationDots();
}

function previousSection() {
    if (currentSection > 1) {
        currentSection--;
        showSection(currentSection);
        updateProgressDisplay();
    }
}

function nextSection() {
    if (currentSection < totalSections) {
        currentSection++;
        showSection(currentSection);
        updateProgressDisplay();
    }
}

function updateProgressDisplay() {
    const progress = Math.round((currentSection / totalSections) * 100);
    
    // Update progress bar
    const progressBar = document.getElementById('moduleProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Update progress text
    const progressText = document.getElementById('progressPercent');
    if (progressText) {
        progressText.textContent = progress;
    }
}

function updateNavigationDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.classList.remove('active');
        if (index + 1 === currentSection) {
            dot.classList.add('active');
        }
    });
}

function initializeNavigation() {
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const sectionNumber = index + 1;
            if (sectionNumber <= currentSection) {
                currentSection = sectionNumber;
                showSection(currentSection);
                updateProgressDisplay();
            }
        });
    });
}

function saveModuleProgress() {
    const moduleName = getModuleName();
    const progress = Math.round((currentSection / totalSections) * 100);
    
    // Load existing progress
    let allProgress = {};
    const savedProgress = localStorage.getItem('segurancaEletricaProgress');
    if (savedProgress) {
        allProgress = JSON.parse(savedProgress);
    }
    
    // Update module progress
    allProgress[moduleName] = progress;
    
    // Save to localStorage
    localStorage.setItem('segurancaEletricaProgress', JSON.stringify(allProgress));
    
    // Update parent page if available
    if (window.parent && window.parent.SegurancaEletrica) {
        window.parent.SegurancaEletrica.updateProgress(moduleName, progress);
    }
}

// Quiz Functionality
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleQuizAnswer(this);
        });
    });
}

function handleQuizAnswer(selectedOption) {
    const question = selectedOption.closest('.quiz-question');
    const options = question.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        
        if (option.dataset.answer === 'correct') {
            option.classList.add('correct');
        } else if (option === selectedOption && option.dataset.answer === 'wrong') {
            option.classList.add('wrong');
        }
    });
    
    // Update score
    if (selectedOption.dataset.answer === 'correct') {
        quizScore++;
        showFeedback('Correto!', 'success');
    } else {
        showFeedback('Incorreto. A resposta correta está destacada.', 'error');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        // Hide current question
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
        
        // Show next question
        currentQuestion++;
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
    } else {
        // Quiz completed
        showQuizResult();
    }
}

function showQuizResult() {
    // Hide quiz container
    document.getElementById('quiz-container').style.display = 'none';
    
    // Show result
    const resultContainer = document.getElementById('quiz-result');
    resultContainer.style.display = 'block';
    
    // Update score
    document.getElementById('final-score').textContent = `${quizScore}/${totalQuestions}`;
    
    // Show finish button
    document.getElementById('finish-module').style.display = 'inline-block';
    
    // Celebrate if perfect score
    if (quizScore === totalQuestions) {
        celebrateSuccess();
    }
}

function celebrateSuccess() {
    // Add celebration animation
    const trophy = document.querySelector('.fa-trophy');
    if (trophy) {
        trophy.style.animation = 'bounce 1s infinite';
    }
    
    // Show success message
    showFeedback('Parabéns! Você acertou todas as questões!', 'success');
}

function finishModule() {
    // Mark module as 100% complete
    const moduleName = getModuleName();
    
    // Update progress
    let allProgress = {};
    const savedProgress = localStorage.getItem('segurancaEletricaProgress');
    if (savedProgress) {
        allProgress = JSON.parse(savedProgress);
    }
    
    allProgress[moduleName] = 100;
    localStorage.setItem('segurancaEletricaProgress', JSON.stringify(allProgress));
    
    // Show completion message
    showCompletionModal();
}

function showCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle text-success me-2"></i>Módulo Concluído!</h3>
            </div>
            <div class="modal-body">
                <p>Parabéns! Você completou com sucesso o módulo de Introdução à Segurança Elétrica.</p>
                <p>Sua pontuação no quiz: <strong>${quizScore}/${totalQuestions}</strong></p>
                <div class="completion-actions">
                    
                    <button class="btn btn-outline-secondary" onclick="goToHome()">
                        <i class="fas fa-home me-2"></i>Voltar ao Início
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
}

function goToNextModule() {
    const currentModule = getModuleName();
    let nextModule = '';
    
    switch(currentModule) {
        case 'introducao':
            nextModule = 'riscos.html';
            break;
        case 'riscos':
            nextModule = 'montagem.html';
            break;
        case 'montagem':
            nextModule = 'manutencao.html';
            break;
        default:
            nextModule = '../index.html#cartilha';
    }
    
    window.location.href = nextModule;
}

function goToHome() {
    window.location.href = '../index.html';
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `alert alert-${type === 'success' ? 'success' : 'danger'} feedback-alert`;
    feedback.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
    `;
    
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        previousSection();
    } else if (e.key === 'ArrowRight') {
        nextSection();
    } else if (e.key === 'Escape') {
        // Close any open modals
        const modal = document.querySelector('.completion-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Add CSS for animations
const moduleStyles = document.createElement('style');
moduleStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    .completion-modal .modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .completion-modal .modal-header h3 {
        color: var(--dark-gray);
        margin-bottom: 1rem;
    }
    
    .completion-modal .modal-body p {
        margin-bottom: 1rem;
        color: #6c757d;
    }
    
    .completion-actions {
        margin-top: 2rem;
    }
    
    @media (max-width: 576px) {
        .completion-modal .modal-content {
            padding: 1.5rem;
            margin: 1rem;
        }
        
        .completion-actions .btn {
            display: block;
            width: 100%;
            margin-bottom: 0.5rem;
        }
        
        .feedback-alert {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(moduleStyles);

