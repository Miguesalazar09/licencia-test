// Sistema de Métricas para el Quiz
class QuizMetrics {
    constructor() {
        this.startTime = new Date();
        this.totalQuestions = 40;
        this.timeLimit = 40 * 60 * 1000; // 40 minutos
        this.timerInterval = null;
        
        // Cargar estado o inicializar
        this.loadState();
        
        this.initializeTimer();
        this.updateMetrics();
        this.saveState();
    }
    
    loadState() {
        const savedState = localStorage.getItem('quizMetrics');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.currentQuestion = state.currentQuestion || 1;
                this.correctAnswers = state.correctAnswers || 0;
                this.incorrectAnswers = state.incorrectAnswers || 0;
                this.timeRemaining = state.timeRemaining || this.timeLimit;
                this.startTime = state.startTime ? new Date(state.startTime) : new Date();
                
                // Verificar si la sesión es muy antigua
                const now = new Date();
                const timeDiff = now - this.startTime;
                const twoHours = 2 * 60 * 60 * 1000;
                
                if (timeDiff > twoHours) {
                    this.resetState();
                    return;
                }
            } catch (error) {
                this.initializeDefaultState();
            }
        } else {
            this.initializeDefaultState();
        }
    }
    
    initializeDefaultState() {
        this.currentQuestion = 1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.timeRemaining = this.timeLimit;
        this.startTime = new Date();
    }
    
    saveState() {
        const state = {
            currentQuestion: this.currentQuestion,
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
            timeRemaining: this.timeRemaining,
            startTime: this.startTime.toISOString()
        };
        localStorage.setItem('quizMetrics', JSON.stringify(state));
    }
    
    resetState() {
        localStorage.removeItem('quizMetrics');
        this.initializeDefaultState();
    }
    
    initializeTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining -= 1000;
            this.updateTimerDisplay();
            this.saveState();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
        
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60000);
        const seconds = Math.floor((this.timeRemaining % 60000) / 1000);
        
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timerElement = document.querySelector('.timer-display');
        
        if (timerElement) {
            timerElement.textContent = display;
            
            // Remover clases anteriores
            timerElement.classList.remove('timer-warning', 'timer-danger');
            const timerCompact = document.querySelector('.timer-compact');
            if (timerCompact) {
                timerCompact.classList.remove('warning', 'danger');
            }
            
            // Aplicar estilos según tiempo restante
            if (this.timeRemaining <= 5 * 60 * 1000) { // 5 minutos
                timerElement.classList.add('timer-danger');
                if (timerCompact) {
                    timerCompact.classList.add('danger');
                }
            } else if (this.timeRemaining <= 10 * 60 * 1000) { // 10 minutos
                timerElement.classList.add('timer-warning');
                if (timerCompact) {
                    timerCompact.classList.add('warning');
                }
            }
            
            // Efecto flash
            timerElement.classList.add('flash');
            setTimeout(() => {
                timerElement.classList.remove('flash');
            }, 200);
        }
    }
    
    timeUp() {
        clearInterval(this.timerInterval);
        this.showTimeUpResults();
    }
    
    showTimeUpResults() {
        const successRate = Math.round((this.correctAnswers / (this.correctAnswers + this.incorrectAnswers)) * 100) || 0;
        alert(`¡Tiempo Agotado!\n\nRespuestas correctas: ${this.correctAnswers}\nPorcentaje de aciertos: ${successRate}%`);
        this.resetState();
        window.Router.navigateTo('home');
    }
    
    updateMetrics() {
        // Actualizar elementos
        this.updateElement('.current-question', this.currentQuestion);
        this.updateElement('.total-questions', this.totalQuestions);
        this.updateElement('.correct-answers', this.correctAnswers);
        this.updateElement('.incorrect-answers', this.incorrectAnswers);
        
        // Actualizar barra de progreso
        this.updateProgressBar();
        
        // Efectos visuales
        this.addCardEffects();
    }
    
    updateElement(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateProgressBar() {
        const answered = this.correctAnswers + this.incorrectAnswers;
        const percentage = (answered / this.totalQuestions) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    addCardEffects() {
        const progressCompact = document.querySelector('.progress-compact');
        if (progressCompact) {
            progressCompact.classList.add('updating');
            setTimeout(() => {
                progressCompact.classList.remove('updating');
            }, 600);
        }
        
        const currentQuestionElement = document.querySelector('.current-question');
        if (currentQuestionElement) {
            currentQuestionElement.classList.add('updating');
            setTimeout(() => {
                currentQuestionElement.classList.remove('updating');
            }, 400);
        }
    }
    
    answerQuestion(isCorrect) {
        if (isCorrect) {
            this.correctAnswers++;
            this.addCorrectAnswerEffect();
        } else {
            this.incorrectAnswers++;
            this.addIncorrectAnswerEffect();
        }
        
        this.updateMetrics();
        this.saveState();
    }
    
    addCorrectAnswerEffect() {
        const answersCompact = document.querySelector('.answers-compact');
        const correctValue = document.querySelector('.correct-answers');
        
        if (answersCompact) {
            answersCompact.classList.add('correct-increment');
            setTimeout(() => {
                answersCompact.classList.remove('correct-increment');
            }, 800);
        }
        
        if (correctValue) {
            correctValue.classList.add('updating');
            setTimeout(() => {
                correctValue.classList.remove('updating');
            }, 600);
        }
    }
    
    addIncorrectAnswerEffect() {
        const answersCompact = document.querySelector('.answers-compact');
        const incorrectValue = document.querySelector('.incorrect-answers');
        
        if (answersCompact) {
            answersCompact.classList.add('incorrect-increment');
            setTimeout(() => {
                answersCompact.classList.remove('incorrect-increment');
            }, 800);
        }
        
        if (incorrectValue) {
            incorrectValue.classList.add('updating');
            setTimeout(() => {
                incorrectValue.classList.remove('updating');
            }, 600);
        }
    }
    
    nextQuestion() {
        this.currentQuestion++;
        this.updateMetrics();
        this.saveState();
        
        if (this.currentQuestion > this.totalQuestions) {
            this.finishQuiz();
        }
    }
    
    finishQuiz() {
        clearInterval(this.timerInterval);
        const timeUsed = this.timeLimit - this.timeRemaining;
        const timeUsedMinutes = Math.floor(timeUsed / 60000);
        const timeUsedSeconds = Math.floor((timeUsed % 60000) / 1000);
        const successRate = Math.round((this.correctAnswers / this.totalQuestions) * 100);
        const passed = successRate >= 80;

        // Efecto de finalización
        const metricsHeader = document.querySelector('.metrics-header');
        if (metricsHeader) {
            metricsHeader.classList.add('quiz-completion-effect');
        }

        // Mostrar página de resultados
        setTimeout(() => {
            this.showResultsPage({
                timeUsedMinutes,
                timeUsedSeconds,
                successRate,
                passed,
                correct: this.correctAnswers,
                incorrect: this.incorrectAnswers,
                total: this.totalQuestions
            });
        }, 1000);
    }

    showResultsPage({ timeUsedMinutes, timeUsedSeconds, successRate, passed, correct, incorrect, total }) {
        // Ocultar quiz y métricas
        document.getElementById('quiz-page').classList.remove('active');
        const metricsHeader = document.querySelector('.metrics-header');
        if (metricsHeader) metricsHeader.style.display = 'none';

        // Crear/mostrar página de resultados
        let resultsPage = document.getElementById('results-page');
        if (!resultsPage) {
            resultsPage = document.createElement('div');
            resultsPage.id = 'results-page';
            resultsPage.className = 'page active';
            document.querySelector('main').appendChild(resultsPage);
        }
                // Inyectar el CSS solo si no está ya presente
                if (!document.getElementById('result-css')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'css/result.css';
                    link.id = 'result-css';
                    document.head.appendChild(link);
                }
                        // Obtener historial de preguntas respondidas
                        let questionHistory = [];
                        if (window.QuizManager && Array.isArray(window.QuizManager.questionHistory)) {
                            questionHistory = window.QuizManager.questionHistory;
                        }

                        // Inyectar el CSS solo si no está ya presente
                        if (!document.getElementById('result-css')) {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = 'css/result.css';
                            link.id = 'result-css';
                            document.head.appendChild(link);
                        }

                        // Generar acordeón HTML
                        let accordionHTML = '';
                        if (questionHistory.length > 0) {
                            accordionHTML = `
                                <div class="result-card">
                                    <h2 style="margin-bottom:10px;">Revisión de preguntas</h2>
                                    <div class="result-accordion" id="result-accordion">
                                        ${questionHistory.map((item, idx) => {
                                            const q = item.question;
                                            // Imagen si existe
                                            let imgHTML = '';
                                            if (q.image && q.image.trim() !== '') {
                                                imgHTML = `<div class='question-img-wrapper' style='display:flex;justify-content:center;margin-bottom:10px;'><img src='${q.image}' alt='Imagen pregunta' class='question-img' style='max-width:220px;max-height:120px;object-fit:contain;border-radius:8px;box-shadow:0 1px 4px #0001;'></div>`;
                                            }
                                            return `
                                            <div class="accordion-item ${item.isCorrect ? 'correct' : 'incorrect'}">
                                                <div class="accordion-header" tabindex="0" data-index="${idx}">
                                                    <span style="font-weight:500;">Pregunta ${idx + 1}</span>
                                                    <span class="icon">${item.isCorrect ? '✔️' : '❌'}</span>
                                                </div>
                                                <div class="accordion-content" id="content-${idx}">
                                                    ${imgHTML}
                                                    <div class="question-title" style="margin-bottom:8px;font-weight:500;">${q.question}</div>
                                                    <div class="question-options" style="margin-bottom:8px;">
                                                        ${q.options.map(opt => {
                                                            let optClass = '';
                                                            if (opt === item.correctAnswer) optClass = 'correct';
                                                            else if (opt === item.selectedAnswer && item.selectedAnswer !== item.correctAnswer) optClass = 'incorrect';
                                                            else optClass = 'disabled';
                                                            return `<div class="option-item ${optClass}" style="margin-bottom:2px;">${opt}</div>`;
                                                        }).join('')}
                                                    </div>
                                                    <div style="margin-bottom:4px;">Tu respuesta: <span class="${item.isCorrect ? 'correct' : 'incorrect'}">${item.selectedAnswer}</span></div>
                                                    <div>Respuesta correcta: <span class="correct">${item.correctAnswer}</span></div>
                                                </div>
                                            </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `;
                        }

                        resultsPage.innerHTML = `
                            <div class="result-container">
                                <div class="result-card">
                                    <h1 class="result-title">¡Examen Completado!</h1>
                                    <div class="result-summary">
                                        <div>⏱ Tiempo usado: <br><span class="result-highlight">${timeUsedMinutes}:${timeUsedSeconds.toString().padStart(2, '0')}</span></div>
                                        <div>📊 Porcentaje: <br><span class="result-highlight">${successRate}%</span></div>
                                        <div>✅ Correctas: <br><span class="result-highlight">${correct}/${total}</span></div>
                                        <div>❌ Incorrectas: <br><span class="result-highlight">${incorrect}</span></div>
                                    </div>
                                    <div class="result-status ${passed ? 'aprobado' : 'reprobado'}">Estado: ${passed ? 'APROBADO' : 'NO APROBADO'}</div>
                                    <button id="restart-quiz-btn" class="result-btn">Volver a intentar</button>
                                </div>
                                ${accordionHTML}
                            </div>
                        `;

                        // Lógica JS para acordeón (solo en la pantalla de resultados)
                        setTimeout(() => {
                            const headers = document.querySelectorAll('.result-accordion .accordion-header');
                            headers.forEach(header => {
                                header.addEventListener('click', function() {
                                    const item = this.parentElement;
                                    const content = item.querySelector('.accordion-content');
                                    const isOpen = item.classList.contains('open');
                                    // Cierra todos
                                    document.querySelectorAll('.result-accordion .accordion-item').forEach(i => {
                                        i.classList.remove('open');
                                        i.querySelector('.accordion-content').style.display = 'none';
                                    });
                                    // Abre el seleccionado si no estaba abierto
                                    if (!isOpen) {
                                        item.classList.add('open');
                                        content.style.display = 'block';
                                    }
                                });
                                // Accesibilidad: abrir con Enter o Space
                                header.addEventListener('keydown', function(e) {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        this.click();
                                    }
                                });
                            });
                            // Abre el primero por defecto
                            const first = document.querySelector('.result-accordion .accordion-item');
                            if(first) {
                                first.classList.add('open');
                                const content = first.querySelector('.accordion-content');
                                if(content) content.style.display = 'block';
                            }
                        }, 100);
        resultsPage.style.display = 'block';

        // Evento para reiniciar
        document.getElementById('restart-quiz-btn').onclick = () => {
            this.resetState();
            resultsPage.style.display = 'none';
            window.Router.navigateTo('home');
        };
    }
    
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// Gestor del Quiz actualizado
class QuizManager {
    showCurrentQuestionFromStorage() {
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        const index = parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
        if (!Array.isArray(questions) || questions.length === 0) {
            // Si no hay preguntas en storage, pedirlas a la API y renderizar la primera
            const categoryId = window.AppState && window.AppState.selectedCategory;
            if (categoryId) {
                fetch(`http://localhost:8081/api/questions?categoryId=${encodeURIComponent(categoryId)}`)
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem('questions', JSON.stringify(data.data));
                        localStorage.setItem('currentQuestionIndex', '0');
                        if (Array.isArray(data.data) && data.data.length > 0) {
                            this.currentQuestion = data.data[0];
                            this.renderQuestion(data.data[0]);
                        } else {
                            window.Router.showError('No hay preguntas disponibles para esta categoría.');
                        }
                    })
                    .catch(() => {
                        window.Router.showError('No se pudieron cargar las preguntas.');
                    });
            } else {
                window.Router.showError('No hay preguntas disponibles para esta categoría.');
            }
            return;
        }
        if (index < questions.length) {
            this.currentQuestion = questions[index];
            this.renderQuestion(questions[index]);
        } else {
            // Fin del examen
            window.Router.showError('¡Examen finalizado!');
        }
    }
    constructor() {
        this.currentQuestion = null;
        this.selectedOption = null;
        this.isAnswered = false;
        this.startTime = null;
        this.questionHistory = [];
        this.metrics = null;
        
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    async startQuiz(category) {
        // Inicializar métricas
        this.metrics = new QuizMetrics();
        // Resetear estado del quiz
        this.questionHistory = [];
        // Ya no se llama a loadQuestion, el flujo usa showCurrentQuestionFromStorage
    }

    // Método loadQuestion eliminado porque no se utiliza en el flujo actual

    renderQuestion(question) {
        // Resetear estado
        this.selectedOption = null;
        this.isAnswered = false;
        document.getElementById('next-question').disabled = true;

        // Título de la pregunta
        document.getElementById('question-title').textContent = question.question;

        // Imagen (si existe)
        const img = document.getElementById('question-img');
        const imgWrapper = img.parentElement;
        const questionImageDiv = imgWrapper; // .question-image
        const mainContainer = document.querySelector('main');
        if (question.image && question.image.trim() !== '') {
            img.src = question.image;
            img.style.display = 'block';
            img.onerror = () => {
                img.style.display = 'none';
                if (questionImageDiv) questionImageDiv.style.display = 'none';
                if (mainContainer) mainContainer.classList.add('no-image');
            };
            if (questionImageDiv) questionImageDiv.style.display = 'flex';
            if (mainContainer) mainContainer.classList.remove('no-image');
        } else {
            img.style.display = 'none';
            if (questionImageDiv) questionImageDiv.style.display = 'none';
            if (mainContainer) mainContainer.classList.add('no-image');
        }

        // Opciones
        this.renderOptions(question.options, question.answer);
    }

    renderOptions(options, correctAnswer) {
        const container = document.getElementById('options-list');
        container.innerHTML = '';

        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.innerHTML = `
                <input type="radio" id="option-${index}" name="answer" value="${option}">
                <label for="option-${index}">${option}</label>
            `;

            // Event listener para selección
            optionElement.addEventListener('click', () => {
                this.selectOption(option, correctAnswer, optionElement);
            });

            container.appendChild(optionElement);
        });
    }

    selectOption(selectedOption, correctAnswer, optionElement) {
        if (this.isAnswered) return;

        // Marcar como respondida
        this.isAnswered = true;
        this.selectedOption = selectedOption;

        // Calcular tiempo de respuesta
        const responseTime = Date.now() - this.startTime;

        // Determinar si es correcta
        const isCorrect = selectedOption === correctAnswer;

        // Aplicar estilos de respuesta
        this.showAnswerFeedback(selectedOption, correctAnswer);

        // Actualizar métricas
        if (this.metrics) {
            this.metrics.answerQuestion(isCorrect);
        }

        // Habilitar botón siguiente
        document.getElementById('next-question').disabled = false;

        // Registrar en historial
        this.questionHistory.push({
            question: this.currentQuestion,
            selectedAnswer: selectedOption,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            responseTime: responseTime
        });

        // console.log(`Respuesta: ${isCorrect ? '✅ Correcta' : '❌ Incorrecta'} (${responseTime}ms)`);
    }

    showAnswerFeedback(selectedAnswer, correctAnswer) {
        const options = document.querySelectorAll('.option-item');
        
        options.forEach(option => {
            const label = option.querySelector('label');
            const optionText = label.textContent;

            if (optionText === correctAnswer) {
                option.classList.add('correct');
            } else if (optionText === selectedAnswer && selectedAnswer !== correctAnswer) {
                option.classList.add('incorrect');
            } else {
                option.classList.add('disabled');
            }
        });
    }

    async nextQuestion() {
        if (!this.isAnswered) return;

        // Avanzar métricas
        if (this.metrics) {
            this.metrics.nextQuestion();
        }

        // Avanzar índice y mostrar siguiente pregunta desde storage
        let index = parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10);
        index++;
        localStorage.setItem('currentQuestionIndex', index.toString());
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        if (index >= questions.length) {
            // Limpiar storage al finalizar
            localStorage.removeItem('questions');
            localStorage.removeItem('currentQuestionIndex');
        }
        this.showCurrentQuestionFromStorage();
    }

    updateQuestionCounter() {
        if (this.metrics) {
            document.getElementById('question-counter').textContent = 
                `Pregunta ${this.metrics.currentQuestion}`;
        }
    }

    updateQuizStats(response) {
        // Actualizar indicador de Redis en la barra de métricas compacta
        const redisStatus = document.getElementById('redis-status');
        if (redisStatus) {
            if (response.redis_enabled) {
                redisStatus.innerHTML = '<i class="fas fa-bolt"></i> Redis activo';
                redisStatus.className = 'status-indicator redis-active';
            } else {
                redisStatus.innerHTML = '<i class="fas fa-database"></i> Archivo';
                redisStatus.className = 'status-indicator redis-inactive';
            }
        }

        console.log(`📊 Estadísticas: ${response.total_questions} preguntas, Cache: ${response.cached ? '✅' : '❌'}`);
    }

    getQuizResults() {
        if (!this.metrics) return null;
        
        const totalQuestions = this.questionHistory.length;
        const correctAnswers = this.questionHistory.filter(q => q.isCorrect).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const avgResponseTime = totalQuestions > 0 
            ? this.questionHistory.reduce((sum, q) => sum + q.responseTime, 0) / totalQuestions 
            : 0;

        return {
            totalQuestions,
            correctAnswers,
            incorrectAnswers: totalQuestions - correctAnswers,
            accuracy: Math.round(accuracy * 100) / 100,
            averageResponseTime: Math.round(avgResponseTime)
        };
    }

    destroy() {
        if (this.metrics) {
            this.metrics.destroy();
            this.metrics = null;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.QuizManager = new QuizManager();

});
