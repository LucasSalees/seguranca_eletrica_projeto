// simulator.js - Lógica de Clique e Posicionamento

class ElectricalSimulator {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.correctConnections = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.placedComponents = new Map();
        this.connections = new Map();
        this.selectedComponent = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTimer();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(parseInt(e.target.dataset.level));
            });
        });

        document.querySelector('[onclick="resetPanel()"]').onclick = () => this.resetPanel();
        document.querySelector('[onclick="checkConnections()"]').onclick = () => this.checkConnections();

        document.querySelectorAll('.component-item').forEach(component => {
            component.addEventListener('click', (e) => {
                this.selectComponent(e.currentTarget);
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('click', (e) => {
                this.placeSelectedComponent(e.currentTarget);
            });
        });
    }

    // --- Nova Lógica de Interação ---

    selectComponent(componentElement) {
        document.querySelectorAll('.component-item').forEach(el => el.classList.remove('active'));
        componentElement.classList.add('active');
        this.selectedComponent = {
            component: componentElement.dataset.component,
            type: componentElement.dataset.type
        };
        document.getElementById('selected-component-name').textContent = this.getComponentName(this.selectedComponent.component);
        document.getElementById('selected-component-display').classList.remove('d-none');
        this.showFeedback(`${this.getComponentName(this.selectedComponent.component)} selecionado! Clique no painel para colocá-lo.`, 'info');
    }

    placeSelectedComponent(zone) {
        if (!this.selectedComponent) {
            this.showFeedback('Selecione um componente primeiro!', 'warning');
            return;
        }

        if (this.canAcceptComponent(zone, this.selectedComponent)) {
            zone.innerHTML = '';
            const placedComponent = document.createElement('div');
            placedComponent.className = 'placed-component';
            placedComponent.innerHTML = `
                <div class="component-icon ${this.getComponentIconClass(this.selectedComponent.component)}">
                    <i class="${this.getComponentIcon(this.selectedComponent.component)}"></i>
                </div>
                <span class="component-name">${this.getComponentName(this.selectedComponent.component)}</span>
                <button class="remove-btn" onclick="simulator.removeComponent('${zone.dataset.connection}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            zone.appendChild(placedComponent);
            zone.classList.add('filled');
            
            this.placedComponents.set(zone.dataset.connection, this.selectedComponent);

            this.selectedComponent = null;
            document.querySelectorAll('.component-item').forEach(el => el.classList.remove('active'));
            document.getElementById('selected-component-display').classList.add('d-none');

            this.updateScore(10);
            this.showFeedback(`${this.getComponentName(this.placedComponents.get(zone.dataset.connection).component)} colocado com sucesso!`, 'success');
            
            this.checkLevelCompletion();
        } else {
            this.showFeedback('Este componente não pode ser colocado aqui!', 'error');
            zone.classList.add('error');
            setTimeout(() => zone.classList.remove('error'), 500);
        }
    }

    // --- Métodos Reutilizados ---
    canAcceptComponent(zone, componentData) {
        if (!componentData || zone.classList.contains('filled')) {
            return false;
        }
        
        const accepts = zone.dataset.accepts.split(',');
        return accepts.includes(componentData.component);
    }

    removeComponent(connectionId) {
        const zone = document.querySelector(`[data-connection="${connectionId}"]`);
        if (zone) {
            zone.innerHTML = `
                <div class="zone-placeholder">
                    <i class="${this.getZoneIcon(zone)}"></i>
                    <span>${this.getZoneName(zone)}</span>
                </div>
            `;
            
            zone.classList.remove('filled');
            this.placedComponents.delete(connectionId);
            this.updateScore(-5);
        }
    }
    
    selectLevel(level) {
        if (level > this.currentLevel + 1) {
            this.showFeedback('Complete o nível anterior primeiro!', 'warning');
            return;
        }
        
        this.currentLevel = level;
        
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === level) {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.panel-level').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`level-${level}`).classList.add('active');
        
        document.getElementById('current-level').textContent = level;
        
        this.resetPanel();
    }
    
    resetPanel() {
        this.placedComponents.clear();
        this.connections.clear();
        
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('filled', 'error');
            zone.innerHTML = `
                <div class="zone-placeholder">
                    <i class="${this.getZoneIcon(zone)}"></i>
                    <span>${this.getZoneName(zone)}</span>
                </div>
            `;
        });
        
        this.score = Math.max(0, this.score - 50);
        this.correctConnections = 0;
        this.updateDisplay();
        
        this.showFeedback('Painel resetado!', 'info');
    }
    
    checkConnections() {
        const requiredConnections = this.getRequiredConnections();
        let correctCount = 0;
        let errors = [];
        
        for (const [connection, component] of this.placedComponents) {
            if (requiredConnections[connection]) {
                if (requiredConnections[connection].includes(component.component)) {
                    correctCount++;
                } else {
                    errors.push(`${this.getZoneName(document.querySelector(`[data-connection="${connection}"]`))} tem componente incorreto`);
                }
            }
        }
        
        for (const [connection, required] of Object.entries(requiredConnections)) {
            if (!this.placedComponents.has(connection)) {
                errors.push(`${this.getZoneName(document.querySelector(`[data-connection="${connection}"]`))} está vazio`);
            }
        }
        
        const totalRequired = Object.keys(requiredConnections).length;
        const percentage = Math.round((correctCount / totalRequired) * 100);
        
        this.showConnectionResults(correctCount, totalRequired, percentage, errors);
        
        this.correctConnections = correctCount;
        this.updateScore(correctCount * 20);
        this.updateDisplay();
        
        if (percentage >= 80) {
            this.completeLevel();
        }
    }
    
    getRequiredConnections() {
        const requirements = {
            1: {
                'main': ['disjuntor'],
                'circuit1': ['dr'],
                'circuit2': ['disjuntor'],
                'output1': ['tomada'],
                'output2': ['lampada']
            },
            2: {
                'main': ['disjuntor'],
                'circuit1': ['dr'],
                'circuit2': ['dr'],
                'circuit3': ['disjuntor'],
                'output1': ['tomada'],
                'output2': ['lampada'],
                'output3': ['tomada', 'lampada']
            },
            3: {
                'main': ['dr'],
                'circuit1': ['dr'],
                'circuit2': ['disjuntor'],
                'circuit3': ['disjuntor'],
                'circuit4': ['disjuntor'],
                'output1': ['tomada'],
                'output2': ['tomada'],
                'output3': ['lampada'],
                'output4': ['lampada']
            }
        };
        
        return requirements[this.currentLevel] || {};
    }
    
    showConnectionResults(correct, total, percentage, errors) {
        const modal = document.getElementById('feedbackModal');
        const title = document.getElementById('feedbackTitle');
        const body = document.getElementById('feedbackBody');
        
        let resultClass = 'success';
        let resultIcon = 'fas fa-check-circle';
        let resultTitle = 'Excelente!';
        
        if (percentage < 50) {
            resultClass = 'danger';
            resultIcon = 'fas fa-times-circle';
            resultTitle = 'Precisa melhorar';
        } else if (percentage < 80) {
            resultClass = 'warning';
            resultIcon = 'fas fa-exclamation-triangle';
            resultTitle = 'Quase lá!';
        }
        
        title.textContent = resultTitle;
        body.innerHTML = `
            <div class="text-${resultClass}">
                <i class="${resultIcon}" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h4>Resultado: ${percentage}%</h4>
                <p>Conexões corretas: ${correct}/${total}</p>
            </div>
            ${errors.length > 0 ? `
                <div class="mt-3">
                    <h6>Problemas encontrados:</h6>
                    <ul class="text-start">
                        ${errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        
        new bootstrap.Modal(modal).show();
    }
    
    completeLevel() {
        setTimeout(() => {
            this.showFeedback(`Nível ${this.currentLevel} concluído!`, 'success');
            
            if (this.currentLevel < 3) {
                const nextLevelBtn = document.querySelector(`[data-level="${this.currentLevel + 1}"]`);
                if (nextLevelBtn) {
                    nextLevelBtn.disabled = false;
                    nextLevelBtn.classList.remove('disabled');
                }
            }
            
            this.updateScore(100);
        }, 2000);
    }
    
    checkLevelCompletion() {
        const requiredConnections = this.getRequiredConnections();
        const totalRequired = Object.keys(requiredConnections).length;
        
        if (this.placedComponents.size >= totalRequired) {
            setTimeout(() => {
                this.checkConnections();
            }, 1000);
        }
    }
    
    getComponentIcon(component) {
        const icons = {
            'disjuntor': 'fas fa-power-off',
            'dr': 'fas fa-shield-alt',
            'fio-fase': 'fas fa-minus',
            'fio-neutro': 'fas fa-minus',
            'fio-terra': 'fas fa-minus',
            'tomada': 'fas fa-plug',
            'lampada': 'fas fa-lightbulb'
        };
        return icons[component] || 'fas fa-question';
    }
    
    getComponentIconClass(component) {
        const classes = {
            'fio-fase': 'wire-red',
            'fio-neutro': 'wire-blue',
            'fio-terra': 'wire-green'
        };
        return classes[component] || '';
    }
    
    getComponentName(component) {
        const names = {
            'disjuntor': 'Disjuntor',
            'dr': 'DR',
            'fio-fase': 'Fio Fase',
            'fio-neutro': 'Fio Neutro',
            'fio-terra': 'Fio Terra',
            'tomada': 'Tomada',
            'lampada': 'Lâmpada'
        };
        return names[component] || 'Componente';
    }
    
    getZoneIcon(zone) {
        const connection = zone.dataset.connection;
        if (connection.includes('main')) return 'fas fa-power-off';
        if (connection.includes('circuit')) return 'fas fa-shield-alt';
        if (connection.includes('output')) return 'fas fa-plug';
        return 'fas fa-question';
    }
    
    getZoneName(zone) {
        const connection = zone.dataset.connection;
        if (connection === 'main') return 'Disjuntor Principal';
        if (connection === 'circuit1') return 'Circuito 1';
        if (connection === 'circuit2') return 'Circuito 2';
        if (connection === 'output1') return 'Saída 1';
        if (connection === 'output2') return 'Saída 2';
        if (connection === 'circuit3') return 'Circuito 3';
        if (connection === 'output3') return 'Saída 3';
        if (connection === 'circuit4') return 'Circuito 4';
        if (connection === 'output4') return 'Saída 4';
        return 'Zona';
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        if (!this.startTime) return;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateScore(points) {
        this.score = Math.max(0, this.score + points);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('correct-connections').textContent = this.correctConnections;
    }
    
    showFeedback(message, type = 'info') {
        const alertClass = type === 'success' ? 'success' : 
                            type === 'error' ? 'danger' : 
                            type === 'warning' ? 'warning' : 'info';
        
        const icon = type === 'success' ? 'check-circle' : 
                        type === 'error' ? 'exclamation-circle' : 
                        type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        const feedback = document.createElement('div');
        feedback.className = `alert alert-${alertClass} simulator-feedback`;
        feedback.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => feedback.remove(), 300);
            }
        }, 4000);
    }
}

// Inicia o simulador ao carregar a página
let simulator;
document.addEventListener('DOMContentLoaded', function() {
    simulator = new ElectricalSimulator();
});

const resetPanel = () => simulator.resetPanel();
const checkConnections = () => simulator.checkConnections();