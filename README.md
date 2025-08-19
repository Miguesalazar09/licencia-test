# 🎯 Quiz Licencia CABA - Arquitectura Frontend/API

Sistema de examen de licencia de conducir para la Ciudad Autónoma de Buenos Aires con arquitectura moderna Frontend/API.

## 🏗️ Arquitectura

### Frontend (SPA - Single Page Application)
- **Puerto**: `8000`
- **Framework**: Vanilla JavaScript con Router SPA
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+
- **Estilo**: Responsive design con Material Design

### API RESTful
- **Puerto**: `8002`
- **Framework**: PHP nativo
- **Cache**: Redis con fallback
- **Base de datos**: JSON (391 preguntas)

## � Estructura del proyecto

```
licencia-test/
├── frontend/                    # 🎨 Frontend SPA
│   ├── index.html              # Página principal
│   ├── css/
│   │   └── style.css           # Estilos responsive
│   └── js/
│       ├── app.js              # Router SPA y lógica principal
│       └── quiz.js             # Gestor del quiz
├── api/                        # 🔧 Backend API
│   ├── endpoints/              # Endpoints REST
│   │   ├── get-question.php    # Obtener preguntas
│   │   └── get-categories.php  # Obtener categorías
│   ├── classes/
│   │   └── RedisCache.php      # Gestión de cache
│   ├── data/
│   │   └── questions.json      # Base de datos de preguntas
│   ├── config/
│   │   └── config.php          # Configuración centralizada
│   └── index.php               # Info de la API
├── images/                     # 🖼️ Recursos compartidos
├── logs/                       # 📊 Logs del sistema
└── start.sh                    # 🚀 Script de inicio
```

## 🚀 Inicio rápido

### Opción 1: Script automático
```bash
./start.sh
```

### Opción 2: Manual
```bash
# Terminal 1 - API
cd api
php -S localhost:8002 -t endpoints

# Terminal 2 - Frontend  
cd frontend
python3 -m http.server 8000

# Acceder a: http://localhost:8000
```

```
licencia-test/
├── app/
│   ├── Controllers/
│   │   └── QuizController.php      # Controlador principal del quiz
│   ├── Data/
│   │   ├── questions.json          # Base de datos de preguntas (3674 preguntas)
│   │   └── used_questions.json     # Registro de preguntas utilizadas
│   ├── Models/
│   │   └── Questions.php           # Modelo para manejo de preguntas
│   ├── Services/
│   │   └── QuizService.php         # Servicio de lógica de negocio
│   └── Views/
│       └── questions.php           # Vista para mostrar preguntas
├── public/
│   ├── index.php                   # Punto de entrada de la aplicación
│   └── style.css                   # Estilos CSS
├── images/                         # Imágenes de las preguntas
├── docker-compose.yml              # Configuración de Docker Compose
├── Dockerfile                      # Configuración del contenedor Docker
└── README.md                       # Este archivo
```

## 🗃️ Archivos Principales

### **Punto de Entrada**
- **`public/index.php`** - Archivo principal que inicia la aplicación

### **Arquitectura MVC**
- **Controlador:** `app/Controllers/QuizController.php` - Maneja las peticiones del usuario
- **Modelo:** `app/Models/Questions.php` - Gestiona los datos de las preguntas
- **Servicio:** `app/Services/QuizService.php` - Lógica de negocio del quiz
- **Vista:** `app/Views/questions.php` - Interfaz de usuario para mostrar preguntas

### **Datos**
- **`app/Data/questions.json`** - Base de datos principal con 3674 preguntas
- **`app/Data/used_questions.json`** - Registro de preguntas ya utilizadas
- **`questions.json`** - Copia de preguntas en la raíz (legacy)
- **`used_questions.json`** - Archivo de control en la raíz (legacy)

### **Recursos**
- **`images/`** - Carpeta con todas las imágenes de las preguntas
- **`public/style.css`** - Estilos CSS legacy
- **`public/css/`** - Estructura organizada de estilos CSS:
  - **`base/`** - Estilos base (variables, reset, tipografía)
  - **`components/`** - Componentes reutilizables (navbar, cards, buttons)
  - **`pages/`** - Estilos específicos por página
  - **`main.css`** - Archivo principal que importa todos los estilos

### **Configuración Docker**
- **`Dockerfile`** - Configuración del contenedor PHP 8.2 con Apache
- **`docker-compose.yml`** - Orquestación del contenedor

### **Scripts Auxiliares**
- **`extraer_preguntas.py`** - Script Python para extraer preguntas
- **`generar_json.py`** - Script para generar archivos JSON
- **`convertir_a_json/`** - Herramientas de conversión de datos

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Docker (Recomendado)

1. **Asegúrate de tener Docker y Docker Compose instalados**

2. **Navega al directorio del proyecto:**
   ```bash
   cd /home/migue/Desktop/licencia-test
   ```

3. **Ejecuta la aplicación:**
   ```bash
   docker-compose up --build
   ```

4. **Accede a la aplicación:**
   - Abre tu navegador web
   - Ve a: `http://localhost:8080`

5. **Para detener la aplicación:**
   ```bash
   docker-compose down
   ```

### Opción 2: Servidor PHP Local

1. **Asegúrate de tener PHP 8.0+ instalado**

2. **Navega al directorio público:**
   ```bash
   cd /home/migue/Desktop/licencia-test/public
   ```

3. **Inicia el servidor PHP:**
   ```bash
   php -S localhost:8000
   ```

4. **Accede a la aplicación:**
   - Abre tu navegador web
   - Ve a: `http://localhost:8000`

### Opción 3: Apache/Nginx

1. **Configura tu servidor web para apuntar a la carpeta `public/`**
2. **Asegúrate de que PHP esté habilitado**
3. **Configura el DocumentRoot a `/ruta/del/proyecto/public`**

## 🔄 Flujo de la Aplicación

1. **`public/index.php`** carga el `QuizController`
2. **El controlador** utiliza `QuizService` para obtener preguntas
3. **El servicio** lee datos de `app/Data/questions.json`
4. **Se renderizan** las vistas con las preguntas seleccionadas
5. **El usuario** responde y recibe retroalimentación inmediata

## 📊 Características

- ✅ **3674 preguntas** de examen de licencia de conducir
- ✅ **Imágenes de apoyo** para preguntas visuales
- ✅ **Retroalimentación inmediata** después de cada respuesta
- ✅ **Seguimiento de preguntas utilizadas** para evitar repeticiones
- ✅ **Interfaz responsive** compatible con dispositivos móviles
- ✅ **Arquitectura MVC** para mantenibilidad del código
- ✅ **Containerización con Docker** para fácil despliegue

## 🛠️ Tecnologías Utilizadas

- **PHP 8.2+** - Lenguaje de programación backend
- **Apache** - Servidor web
- **HTML5/CSS3** - Frontend
- **JavaScript** - Interactividad del cliente
- **JSON** - Almacenamiento de datos
- **Docker** - Containerización
- **Font Awesome** - Iconografía

## 📝 Estructura de Datos

### Formato de Preguntas (JSON)
```json
{
  "question": "Texto de la pregunta",
  "options": ["Opción A", "Opción B", "Opción C"],
  "answer": "Respuesta correcta",
  "image": "images/imagen-ejemplo.png"
}
```

## 🔧 Desarrollo

### Agregar Nuevas Preguntas
1. Edita el archivo `app/Data/questions.json`
2. Agrega las imágenes correspondientes en la carpeta `images/`
3. Sigue el formato JSON establecido

### Modificar Estilos
- **Estructura organizada**: Los estilos están separados en `public/css/`
- **Variables CSS**: Edita `public/css/base/variables.css` para colores y espaciado
- **Componentes**: Modifica `public/css/components/` para botones, cards, navbar
- **Páginas específicas**: Edita `public/css/pages/` para estilos por vista
- **Importación**: El archivo `public/css/main.css` importa todos los estilos

### Extensiones Futuras
- Base de datos SQL para mayor escalabilidad
- Sistema de usuarios y puntuaciones
- Reportes de desempeño
- API REST para integración con aplicaciones móviles

## 🐛 Resolución de Problemas

### Error: "El archivo questions.json está vacío"
- Verifica que el archivo `app/Data/questions.json` existe y contiene datos válidos
- Revisa los permisos de lectura del archivo

### Imágenes no se cargan
- Verifica que las imágenes existen en la carpeta `images/`
- Revisa las rutas en el archivo JSON

### Puerto 8080 ocupado
- Cambia el puerto en `docker-compose.yml`
- O usa: `docker-compose up -p NUEVO_PUERTO`

## 📄 Licencia

Este proyecto es de uso educativo y está disponible bajo licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Nota:** Este sistema está diseñado para práctica y estudio. Para uso en exámenes oficiales, consulta con las autoridades de tránsito correspondientes.
