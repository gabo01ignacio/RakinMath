# Tareas - RakinMath

## Estado Actual del Proyecto

**Fase:** Desarrollo activo
**Última revisión:** Julio 2026

---

## Resumen de Estado

| Módulo | Estado | Progreso |
|--------|--------|----------|
| Landing Page v2 | ✅ Completo | 100% |
| Menú de Juegos | ✅ Completo | 100% |
| 7 Juegos | ✅ Completos | 100% |
| Menú de Aprender | ✅ Completo | 100% |
| Páginas de Contenido | 🔶 Parcial | 13% (5/38) |
| Documentación | ✅ Completo | 100% |

---

## ✅ Completado

### Landing Page (`v2/index.html`)
- [x] Navegación con logo y links
- [x] Toggle tema claro/oscuro
- [x] Hero con badge animado y CTA
- [x] Secciones: Qué es, Para qué sirve
- [x] Scroll animations (IntersectionObserver)
- [x] Footer con copyright
- [x] Responsive design

### Menú de Juegos (`v2/Juegos/menu.html`)
- [x] Modal de registro (nombre, grado, modo)
- [x] Persistencia en localStorage
- [x] Filtrado por grado
- [x] Selector de modo (Aprender/Practicar)
- [x] Cerrar sesión

### Juegos (7/7)
- [x] Juego 1: Duelo de Números (5° básico)
- [x] Juego 2: Estimaciones (5° básico)
- [x] Juego 3: Chefs de Fracciones (4°-5°)
- [x] Juego 4: Arquitectas (4°-5°)
- [x] Juego 5: Buscatesoros (5° básico)
- [x] Juego 6: El Caldero Mágico (5°-6°)
- [x] Juego 7: Misión Robot (4° básico)

### Menú de Aprender (`v2/Aprender/menu.html`)
- [x] 5 ejes curriculares del Mineduc
- [x] Navegación a todas las páginas
- [x] Diseño responsive

### Páginas de Contenido (5/38)
- [x] `numeros-sumas.html` - Suma vertical con lleva 1
- [x] `frac-suma.html` - Suma visual de fracciones
- [x] `geo-cuadricula.html` - Cuadrícula pirata/tesoro
- [x] `datos-barras.html` - Gráfico de barras interactivo
- [x] `alg-ecuaciones.html` - Balanza de ecuaciones

### Sistema de Diseño
- [x] `apple-design.css` con componentes UI
- [x] Paleta de colores light/dark
- [x] Glassmorphism
- [x] Animaciones CSS
- [x] Spring curves
- [x] Responsive breakpoints

---

## 🔶 Pendiente - Prioridad Alta

### Páginas de Contenido (33 restantes)

#### Números (7 páginas)
- [ ] `numeros.html` - Números hasta el 10.000
- [ ] `numeros-calculo-mental.html` - Cálculo mental
- [ ] `numeros-restas.html` - Restas con préstamo
- [ ] `numeros-tablas.html` - Tablas de multiplicar
- [ ] `numeros-multiplicar.html` - Multiplicación 2/3 x 1
- [ ] `numeros-division.html` - División con resto
- [ ] `numeros-dinero.html` - Problemas con dinero

#### Fracciones (4 páginas)
- [ ] `frac-representar.html` - Representar fracciones
- [ ] `frac-resta.html` - Resta de fracciones
- [ ] `frac-dec-suma.html` - Suma de decimales
- [ ] `frac-dec-resta.html` - Resta de decimales

#### Geometría (5 páginas)
- [ ] `geo-figuras.html` - Figuras 2D y 3D
- [ ] `geo-angulos.html` - Ángulos
- [ ] `geo-simetria.html` - Simetría
- [ ] `geo-transformaciones.html` - Transformaciones 2D
- [ ] `geo-area.html` - Área de rectángulos

#### Medición (5 páginas)
- [ ] `geo-reloj.html` - Reloj analógico/digital
- [ ] `medicion-tiempo.html` - Conversiones de tiempo
- [ ] `medicion-longitud.html` - Longitud
- [ ] `medicion-perimetro.html` - Perímetro
- [ ] `medicion-volumen.html` - Volumen

#### Datos (2 páginas)
- [ ] `datos-pictogramas.html` - Pictogramas
- [ ] `datos-frecuencias.html` - Tablas de frecuencias

#### Álgebra (2 páginas)
- [ ] `alg-inecuaciones.html` - Inecuaciones
- [ ] `alg-secuencias.html` - Secuencias

---

## 🔶 Pendiente - Prioridad Media

### Funcionalidades
- [ ] Sistema de puntuación global (localStorage)
- [ ] Ranking/leaderboard por grado
- [ ] Modo "Profesor" con estadísticas
- [ ] Modo oscuro en páginas de contenido (actualmente solo en landing)
- [ ] Animaciones de transición entre páginas
- [ ] Sonidos de feedback (correcto/incorrecto)
- [ ] Modo offline (Service Worker)

### Contenido
- [ ] Agregar links de videos educativos a cada tema
- [ ] Agregar más ejemplos del contexto chileno
- [ ] Crear PDFs descargables de cada tema
- [ ] Agregar nivel de dificultad a los quizzes

### Diseño
- [ ] Unificar `apple-design.css` en un solo archivo compartido
- [ ] Optimizar imágenes (LogoRakinMath.png, RakinMath.png)
- [ ] Agregar favicon a todas las páginas
- [ ] Mejorar accesibilidad (ARIA labels, contraste)

---

## 🔶 Pendiente - Prioridad Baja

### Futuro
- [ ] Extender contenido a 5° básico
- [ ] Extender contenido a 6° básico
- [ ] Agregar juego 8+: Tetris de números
- [ ] Agregar juego 8+: Sudoku educativo
- [ ] Modo multijugador en red (WebSocket)
- [ ] App móvil (PWA o React Native)
- [ ] Dashboard de progreso para profesores
- [ ] Integración con Google Classroom

### Técnico
- [ ] Migrar a TypeScript para mejor tipado
- [ ] Agregar tests unitarios
- [ ] Configurar CI/CD
- [ ] Optimizar rendimiento (lazy loading)
- [ ] SEO y meta tags para cada página

---

## Roadmap Sugerido

### Fase 1: Completar Contenido (4° básico)
1. Completar las 7 páginas de Números
2. Completar las 4 páginas de Fracciones
3. Completar las 5 páginas de Geometría
4. Completar las 5 páginas de Medición
5. Completar las 2 páginas de Datos
6. Completar las 2 páginas de Álgebra

### Fase 2: Mejoras de UX
1. Modo oscuro en todas las páginas
2. Sistema de puntuación global
3. Transiciones entre páginas
4. Sonidos de feedback
5. Videos educativos

### Fase 3: Expansión
1. Contenido para 5° básico
2. Contenido para 6° básico
3. Modo profesor
4. PWA / Offline

---

## Notas de Desarrollo

- **No usar frameworks** - El proyecto es HTML/CSS/JS puro
- **Mantener apple-design.css** como sistema de diseño compartido
- **Seguir patrones existentes** al crear nuevas páginas
- **Priorizar mobile-first** en todo el diseño
- **Usar localStorage** para persistencia (no backend)
- **Incluir contexto chileno** en todos los ejemplos
