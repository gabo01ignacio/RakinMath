# Arquitectura del Proyecto RakinMath

## Descripción General

**RakinMath** es una plataforma web educativa interactiva de matemáticas para niños de 4°, 5° y 6° básico del sistema educativo chileno (Mineduc). El nombre "Rakin" proviene del mapudungun y significa "contar, calcular o sacar cuentas".

**Filosofía:** Transformar el aprendizaje de matemáticas en una experiencia interactiva basada en juegos. "Equivocarse es solo un paso más en el camino hacia el conocimiento".

## Stack Tecnológico

- **HTML5 puro** - Sin frameworks de JavaScript
- **CSS vanilla** con Custom Properties (CSS Variables)
- **JavaScript vanilla** (sin dependencias externas)
- **SVG** para gráficos interactivos
- **localStorage** para persistencia de datos del usuario
- **Google Fonts** - Fuente Inter

## Estructura del Proyecto

```
RakinMath/
├── v2/                          # VERSIÓN ACTIVA - Aplicación web completa
│   ├── index.html               # Landing page con tema claro/oscuro
│   ├── Aprender/                # Módulo educativo (38 archivos)
│   │   ├── apple-design.css     # Sistema de diseño compartido
│   │   ├── menu.html            # Menú principal de materias (4° básico)
│   │   ├── numeros-*.html       # 8 temas de números y operaciones
│   │   ├── frac-*.html          # 5 temas de fracciones
│   │   ├── geo-*.html           # 6 temas de geometría
│   │   ├── medicion-*.html      # 5 temas de medición
│   │   ├── datos-*.html         # 3 temas de datos
│   │   └── alg-*.html           # 3 temas de álgebra
│   ├── Juegos/                  # Módulo de juegos (9 archivos)
│   │   ├── apple-design.css     # Sistema de diseño compartido
│   │   ├── menu.html            # Menú de juegos con modal de bienvenida
│   │   ├── juego1.html          # Duelo de Números
│   │   ├── juego2.html          # Estimaciones
│   │   ├── juego3.html          # Chefs de Fracciones
│   │   ├── juego4.html          # Arquitectas
│   │   ├── juego5.html          # Buscatesoros
│   │   ├── juego6.html          # El Caldero Mágico
│   │   └── juego7.html          # Misión Robot
│   ├── Animaciones/             # Carpeta para animaciones (planeado)
│   └── Recursos/                # Imágenes del proyecto
│       ├── LogoRakinMath.png    # Logo de la marca
│       ├── RakinMath.png        # Imagen hero principal
│       └── fotosaladeclases.png # Foto de sala de clases
└── docs/                        # Documentación del proyecto
    ├── ARCHITECTURE.md          # Este archivo
    ├── IDENTITY.md              # Identidad de marca
    ├── DESIGN.md                # Sistema de diseño
    ├── ANIMATIONS.md            # Animaciones y transiciones
    ├── GAMES.md                 # Documentación de juegos
    ├── CURRICULUM.md            # Contenido educativo
    └── TASKS.md                 # Estado y roadmap
```

## Módulos Principales

### 1. Landing Page (`v2/index.html`)
- Navegación con logo, links y botón "Jugar"
- Toggle de tema claro/oscuro con persistencia en localStorage
- Hero con badge animado, título y CTA
- Secciones: Qué es, Para qué sirve, CTA final
- Scroll animations con IntersectionObserver
- Footer con copyright

### 2. Módulo de Aprender (`v2/Aprender/`)
- **Menú** con 5 ejes curriculares del Mineduc
- **38 páginas** organizadas por tema
- Cada página de contenido incluye:
  - Explicación del concepto
  - Cajas de colores para info/tip/advertencia
  - Actividad interactiva/demo visual
  - Quiz/resolución de problemas
  - Sección de videos (placeholder)
- **5 páginas con contenido interactivo funcional:**
  - `numeros-sumas.html` - Suma vertical paso a paso con lleva 1
  - `frac-suma.html` - Suma visual de fracciones con barras
  - `geo-cuadricula.html` - Juego pirata/tesoro en cuadrícula
  - `datos-barras.html` - Constructor de gráficos de barras
  - `alg-ecuaciones.html` - Balanza interactiva de ecuaciones
- **33 páginas** muestran "Próximamente"

### 3. Módulo de Juegos (`v2/Juegos/`)
- **Menú** con sistema de registro (nombre, grado, modo)
- **7 juegos interactivos** completamente funcionales
- Persistencia de datos en localStorage
- Filtrado por grado
- Modos: Aprender / Practicar

## Sistema de Diseño

### Archivo Compartido: `apple-design.css`
Ubicado tanto en `v2/Aprender/` como en `v2/Juegos/`. Contiene:
- Custom Properties completos (colores, radii, spacing, timing)
- Componentes UI reutilizables (nav, cards, buttons, inputs, badges, toast, modal)
- Clases de utilidad
- Animaciones CSS predefinidas
- Sistema de glassmorphism

### Paleta de Colores (Light Theme)
- Fondo: `#f5f5f7`
- Tarjetas: `rgba(255,255,255,0.8)` con glassmorphism
- Texto: `#1d1d1f`
- Acento: `#007aff` (Azul Apple)
- Verde: `#34c759`
- Naranja: `#ff9500`
- Morado: `#af52de`
- Rojo: `#ff3b30`

### Paleta de Colores (Dark Theme)
- Fondo: `#0a0a0a`
- Tarjetas: `rgba(28,28,30,0.75)`
- Texto: `#f5f5f7`
- Acento: `#0a84ff`
- Verde: `#30d158`
- Naranja: `#ff9f0a`
- Morado: `#bf5af2`

## Persistencia de Datos

### localStorage
- **Usuario:** `{ name, grade, mode }` - Datos del jugador actual
- **Temas:** `theme` - Preferencia de tema (light/dark)
- **Puntuaciones:** Guardadas por juego individual

### Flujo de Usuario
1. Usuario llega al `index.html` (landing)
2. Hace clic en "Jugar" → `Juegos/menu.html`
3. Modal de registro pide nombre, grado, modo
4. Datos se guardan en localStorage
5. Accede a juegos filtrados por su grado
6. Puede cambiar a modo "Aprender" → `Aprender/menu.html`

## Responsive Design

- **Mobile-first** con breakpoints:
  - 480px (móvil pequeño)
  - 640px (móvil grande)
  - 700px (tablet pequeño)
  - 768px (tablet)
  - 900px (desktop pequeño)
  - 1024px (desktop)
- **Cards:** Stack vertical en móvil, grid en desktop
- **Navegación:** Collapsible en móvil
- **Juegos:** Adaptados a pantalla completa en móvil

## Archivos Excluidos (v1 - Obsoletos)

Los siguientes archivos son de la versión 1 (Astro) y NO están activos:
- `src/` - Componentes Astro originales (nombre "KimunMath")
- `CAMBIOS/` - Documentación de cambios de diseño v1
- `dist/` - Build de Astro
- `astro.config.mjs`, `tailwind.config.mjs`, `package.json`
- `node_modules/`, `.astro/`
- `.agents/`, `skills-lock.json`
- `Rakin.md` (documento de marca original)
