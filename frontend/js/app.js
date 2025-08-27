// ...existing code...

// ...existing code...

// Estado global de la aplicación
const AppState = {
    currentPage: 'home',
    selectedCategory: null,
    categories: {},
    questionCount: 0,
    isLoading: false
};

// Router SPA
class SPARouter {
    constructor() {
        this.routes = {
            'home': () => this.showHomePage(),
            'quiz': () => this.showQuizPage()
        };
        this.init();
    }

    init() {
        // Cargar página inicial
        this.navigateTo('home');
        
        // Event listeners para navegación
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.navigateTo('home');
        });
        
        // Event listener para botón compacto en métricas
        document.getElementById('back-to-home-compact').addEventListener('click', () => {
            this.navigateTo('home');
        });
    }

    navigateTo(page, params = {}) {
        if (this.routes[page]) {
            AppState.currentPage = page;
            Object.assign(AppState, params);
            this.routes[page]();
        }
    }

    showHomePage() {
        this.showPage('home-page');
        
        // Ocultar barra de métricas
        const metricsHeader = document.querySelector('.metrics-header');
        if (metricsHeader) {
            metricsHeader.style.display = 'none';
        }
        
        // Limpiar métricas y timer
        if (window.QuizManager && window.QuizManager.metrics) {
            window.QuizManager.destroy();
        }
        
        //this.loadCategories();
    }

    showQuizPage() {
        this.showPage('quiz-page');
        
        // Mostrar barra de métricas horizontal
        const metricsHeader = document.querySelector('.metrics-header');
        if (metricsHeader) {
            metricsHeader.style.display = 'block';
        }
        
        if (AppState.selectedCategory) {
            this.updateCategoryTitle();
            
            // Limpiar métricas previas si las hay
            if (window.QuizManager && window.QuizManager.metrics) {
                window.QuizManager.destroy();
            }
            
            // Iniciar nuevo quiz con métricas
            setTimeout(() => {
                window.QuizManager.startQuiz(AppState.selectedCategory);
            }, 100);
        }
    }

    showPage(pageId) {
        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar página seleccionada
        document.getElementById(pageId).classList.add('active');
    }

    // Método eliminado: loadCategories

    renderCategories(categories) {
        const grid = document.getElementById('categories-grid');
        grid.innerHTML = '';
        // console.log(categories.data);
        Object.values(categories.data).forEach(category => {
            // Buscar icono según la categoría (por código, ej: 'A', 'B', ...)
            let iconFile = window.categoryIcons && window.categoryIcons[category.category] ? window.categoryIcons[category.category] : 'logo-caba.png';
            const iconHtml = `<img src="images/icons/${iconFile}" alt="icono ${category.category}" style="height:48px;">`;

            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${iconHtml}</div>
                <h4>Categoria  ${category.category}</h4>
                <p>${category.description}</p>
                <button class="btn-primary" data-category="${category.id}">
                    Comenzar Examen
                </button>
            `;

            // Event listener para selección de categoría
            card.querySelector('button').addEventListener('click', (e) => {
                const categoryId = e.target.dataset.category;
                this.selectCategory(categoryId);
            });

            grid.appendChild(card);
        });
    }

    selectCategory(categoryId) {
        AppState.selectedCategory = categoryId;
        AppState.questionCount = 0;
        // Buscar preguntas de la categoría seleccionada
        fetch(`http://localhost:8081/api/questions?categoryId=${encodeURIComponent(categoryId)}`)
            .then(res => res.json())
            .then(data => {
                // Guardar el array de preguntas directamente
                localStorage.setItem('questions', JSON.stringify(data));
                localStorage.setItem('currentQuestionIndex', '0');
                // Navegar a la página de quiz
                this.navigateTo('quiz');
                // Mostrar la primera pregunta
                if (window.QuizManager && typeof window.QuizManager.showCurrentQuestionFromStorage === 'function') {
                    window.QuizManager.showCurrentQuestionFromStorage();
                }
            })
            .catch(err => {
                this.showError('Error al cargar preguntas: ' + err);
            });
    }

    updateCategoryTitle() {
        const category = AppState.categories[AppState.selectedCategory];
        if (category) {
            // Actualizar título original (oculto)
            document.getElementById('category-title').textContent = category.name;
            
            // Actualizar título compacto en métricas
            const titleCompact = document.getElementById('category-title-compact');
            if (titleCompact) {
                titleCompact.textContent = category.name;
            }
        }
    }

    // Método eliminado: apiRequest

    showLoading(show) {
        AppState.isLoading = show;
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        // Implementar notificación de error
        console.error(message);
        alert(message); // Temporal - mejorar con toast notifications
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.Router = new SPARouter();
    // Exportar para uso global
    window.AppState = AppState;

    // Cargar y renderizar categorías al iniciar
    fetch('http://localhost:8081/api/categories')
        .then(res => res.json())
        .then(data => {
            // Guardar en AppState
            AppState.categories = data;
            // console.log('CATS', data);
            // Renderizar usando el router
            if (window.Router && typeof window.Router.renderCategories === 'function') {
                window.Router.renderCategories(data);
            }
        })
        .catch(err => {
            console.error('Error al cargar categorías:', err);
        });
});
