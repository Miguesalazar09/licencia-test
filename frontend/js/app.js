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

        Object.values(categories).forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <h4>${category.name}</h4>
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
        this.navigateTo('quiz');
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
});

// Exportar para uso global
window.AppState = AppState;

fetch('http://localhost:8081/api/categories')
  .then(res => res.json())
  .then(data => {
    console.log('Respuesta de la API:', data);
  });
