class QuizAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.isRecording = true;
    }
    
    generateSessionId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Registrar eventos del usuario
    trackEvent(eventType, data = {}) {
        if (!this.isRecording) return;
        
        const event = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            eventType: eventType,
            data: {
                ...data,
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        this.events.push(event);
        this.saveToLocalStorage();
        
        // Enviar al servidor cada 10 eventos
        if (this.events.length % 10 === 0) {
            this.sendBatch();
        }
    }
    
    // Eventos específicos del quiz
    trackQuizStart(category) {
        this.trackEvent('quiz_start', { category });
    }
    
    trackQuestionView(questionId, responseTime) {
        this.trackEvent('question_view', { 
            questionId, 
            responseTime,
            timeSpent: Date.now() - this.startTime 
        });
    }
    
    trackAnswer(questionId, selectedAnswer, correctAnswer, responseTime) {
        this.trackEvent('answer_submitted', {
            questionId,
            selectedAnswer,
            correctAnswer,
            isCorrect: selectedAnswer === correctAnswer,
            responseTime,
            hesitationTime: responseTime > 10000 ? responseTime : null
        });
    }
    
    trackQuizCompletion(results) {
        this.trackEvent('quiz_completed', {
            ...results,
            totalDuration: Date.now() - this.startTime
        });
        
        this.sendBatch(); // Enviar todos los eventos pendientes
    }
    
    // Detectar patrones sospechosos
    detectCheating() {
        const suspiciousPatterns = [];
        
        // Respuestas muy rápidas consistentes
        const quickAnswers = this.events.filter(e => 
            e.eventType === 'answer_submitted' && 
            e.data.responseTime < 2000
        );
        
        if (quickAnswers.length > 10) {
            suspiciousPatterns.push('very_fast_answers');
        }
        
        // Cambio de pestaña frecuente
        const tabChanges = this.events.filter(e => e.eventType === 'tab_switch');
        if (tabChanges.length > 5) {
            suspiciousPatterns.push('frequent_tab_switching');
        }
        
        return suspiciousPatterns;
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('quiz_analytics', JSON.stringify({
                sessionId: this.sessionId,
                events: this.events.slice(-50) // Mantener solo los últimos 50
            }));
        } catch (e) {
            console.warn('No se pudo guardar analytics:', e);
        }
    }
    
    async sendBatch() {
        if (this.events.length === 0) return;
        
        try {
            // Eliminado: fetch a /api/analytics
            // Aquí se enviaban los eventos al servidor
            // Se ha eliminado la llamada a la API
            
            this.events = []; // Limpiar eventos enviados
        } catch (error) {
            console.warn('Error enviando analytics:', error);
        }
    }
}

// Detectar cambios de pestaña/ventana
document.addEventListener('visibilitychange', () => {
    if (window.QuizAnalytics) {
        window.QuizAnalytics.trackEvent('tab_switch', {
            hidden: document.hidden
        });
    }
});

// Detectar copy/paste
document.addEventListener('paste', (e) => {
    if (window.QuizAnalytics) {
        window.QuizAnalytics.trackEvent('paste_detected', {
            target: e.target.tagName
        });
    }
});

// Detectar intentos de inspeccionar elemento
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        if (window.QuizAnalytics) {
            window.QuizAnalytics.trackEvent('devtools_attempt');
        }
    }
});
